import * as dotenv from 'dotenv';

dotenv.config({ path: '.test.env' });
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { faker } from '@faker-js/faker/.';
import DataEntry from '../src/common/helpers/DataEntry';
import { UserService } from '../src/user/user.service';
import { AppModule } from '../src/app.module';
import { UserRole } from '../src/user/user.enums';
import { CreateReferralDto } from '../src/referral/referral.dto';
import { PostCommissionWithCodeDto, UpdateCommissionDto } from '../src/commission/commission.dto';
import { UpdateAgentDocumentDto, UpdateAgentDocumentStatusDto } from '../src/agent-document/agent-document.dto';
import { DocumentStatus, ErrorMessage } from '../src/common/common.enum';
import { CommissionStatus } from '../src/commission/commission.enums';
import { CreateAgentDto, UpdateAgentStatusDto } from '../src/agent/agent.dto';
import { Agent } from '../src/agent/agent.entity';
import { User } from '../src/user/user.entity';
import { S3UploaderService } from '../src/s3-uploader/s3-uploader.service';
import { NotificationService } from '../src/notification/notification.service';
import { AgentStatus } from '../src/agent/agent.enums';

describe('Agent Onboarding Story (e2e)', () => {
    jest.setTimeout(60000);

    let app: INestApplication;
    let s3UploaderService: S3UploaderService;
    let userService: UserService;
    let notificationService: NotificationService;

    let createAgentDto: CreateAgentDto;
    let agent: Agent;
    let agentUser: User;
    let customer: User;
    let agentToken: string;

    let reuploadDto: UpdateAgentDocumentDto;
    let updateAgentDocumentStatusDto: UpdateAgentDocumentStatusDto;
    let updateAgentStatusDto: UpdateAgentStatusDto;
    let createCommissionDto: PostCommissionWithCodeDto;
    let updateCommissionDto: UpdateCommissionDto;

    let firstCommissionId: number;
    let totalCommissionFromPosts = 0;

    const auth = () => ({ Authorization: `Bearer ${agentToken}` });

    const req = () => request(app.getHttpServer());

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );

        userService = moduleFixture.get<UserService>(UserService);
        s3UploaderService = moduleFixture.get<S3UploaderService>(S3UploaderService);
        notificationService = moduleFixture.get<NotificationService>(NotificationService);

        const notificationResponse = {
            message: 'Sent',
            statusCode: 200,
            data: {
                message: 'Enqueued',
                statusCode: 200,
                success: true,
            },
        };

        jest
            .spyOn(notificationService, 'sendEmail')
            .mockImplementation(async () => Promise.resolve(notificationResponse as any));

        jest
            .spyOn(s3UploaderService, 'deleteFromS3')
            .mockImplementation(async () => Promise.resolve());

        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    it('creates an agent profile from a signed-up user', async () => {
        agentUser = await userService.create(DataEntry.createUserDto);
        createAgentDto = DataEntry.buildCreateAgentDto(agentUser.id);
        agentToken = sign(
            { user_id: agentUser.id, roles: [UserRole.AGENT] },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' },
        );

        await req()
            .post('/agents')
            .set(auth())
            .send(createAgentDto)
            .expect(HttpStatus.CREATED)
            .expect((res) => {
                expect(res.body).toHaveProperty('data');
                agent = res.body.data as Agent;
                expect(agent.id).toBeDefined();
                expect(agent.name).toBe(createAgentDto.name);
                expect(agent.agentType).toBe(createAgentDto.agentType);
                expect(agent.status).toBe(AgentStatus.BASIC_INFO);
            });
    });

    it('simulates email verification advancing status to EMAIL_VERIFIED', async () => {
        // EMAIL_VERIFIED is normally triggered by the external auth service.
        // We exercise the same update-status endpoint it would call.
        await req()
            .post(`/agents/${agent.id}/update-status`)
            .set(auth())
            .send({
                status: AgentStatus.EMAIL_VERIFIED,
                reviewerId: agentUser.id,
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(AgentStatus.EMAIL_VERIFIED);
            });
    });

    it('agent updates bank details and advances status to PROFILE_SETUP', async () => {
        await req()
            .patch(`/agents/${agent.id}`)
            .set(auth())
            .send({
                id: agent.id,
                bankName: 'Access Bank Plc',
                accountName: createAgentDto.name,
                accountNumber: '0123456789',
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.bankName).toBe('Access Bank Plc');
                expect(res.body.data.accountNumber).toBe('0123456789');
            });

        await req()
            .post(`/agents/${agent.id}/update-status`)
            .set(auth())
            .send({
                status: AgentStatus.PROFILE_SETUP,
                reviewerId: agentUser.id,
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(AgentStatus.PROFILE_SETUP);
            });
    });

    it('retrieves the newly created agent by id and by user id', async () => {
        await req()
            .get(`/agents/${agent.id}`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.id).toBe(agent.id);
                expect(res.body.data.name).toBe(createAgentDto.name);
            });

        await req()
            .get(`/agents/by-user/${agentUser.id}`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.id).toBe(agent.id);
            });
    });

    it('loads the agent document bucket and starts with pending review', async () => {
        await req()
            .get(`/agents/${agent.id}/agent-documents`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(Array.isArray(res.body.data)).toBe(true);
                expect(res.body.data.length).toBeGreaterThan(0);
                expect(res.body.data[0].status).toBe(DocumentStatus.PENDING);
            });
    });

    it('reuploads a document and keeps the total document count stable', async () => {
        const docsBefore = await req()
            .get(`/agents/${agent.id}/agent-documents`)
            .set(auth())
            .expect(HttpStatus.OK);

        const documentCountBefore = docsBefore.body.data.length;
        const firstDocumentId = docsBefore.body.data[0].id;

        reuploadDto = {
            url: 'https://chatgpt.com/',
            name: 'Updated onboarding document',
        };

        await req()
            .patch(`/agent-documents/${firstDocumentId}`)
            .set(auth())
            .send(reuploadDto)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.url).toBe(reuploadDto.url);
                expect(res.body.data.name).toBe(reuploadDto.name);
                expect(res.body.data.status).toBe(DocumentStatus.PENDING);
            });

        await req()
            .get(`/agents/${agent.id}`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(AgentStatus.DOCUMENTS_UPLOADED);
            });

        await req()
            .get(`/agents/${agent.id}/agent-documents`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.length).toBe(documentCountBefore);
            });
    });

    it('agent accepts terms and submits application advancing status to SUBMITTED', async () => {
        await req()
            .post(`/agents/${agent.id}/update-status`)
            .set(auth())
            .send({
                status: AgentStatus.SUBMITTED,
                reviewerId: agentUser.id,
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(AgentStatus.SUBMITTED);
            });
    });

    it('enforces decline reason and supports document review transitions', async () => {
        const docs = await req()
            .get(`/agents/${agent.id}/agent-documents`)
            .set(auth())
            .expect(HttpStatus.OK);

        const firstDocumentId = docs.body.data[0].id;

        updateAgentDocumentStatusDto = {
            status: DocumentStatus.APPROVED,
            reviewerId: 1,
        };

        await req()
            .post(`/agent-documents/${firstDocumentId}/update-status`)
            .set(auth())
            .send(updateAgentDocumentStatusDto)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(DocumentStatus.APPROVED);
            });

        await req()
            .post(`/agent-documents/${firstDocumentId}/update-status`)
            .set(auth())
            .send({
                ...updateAgentDocumentStatusDto,
                status: DocumentStatus.DECLINED,
                declineReason: null,
            })
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
                expect(res.body.message).toBe(ErrorMessage.NO_REASON_DECLINE);
            });

        await req()
            .post(`/agent-documents/${firstDocumentId}/update-status`)
            .set(auth())
            .send({
                ...updateAgentDocumentStatusDto,
                status: DocumentStatus.DECLINED,
                declineReason: 'Malformed document',
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(DocumentStatus.DECLINED);
                expect(res.body.data.declineReason).toBe('Malformed document');
            });

        await req()
            .post(`/agent-documents/${firstDocumentId}/update-status`)
            .set(auth())
            .send({
                ...updateAgentDocumentStatusDto,
                status: DocumentStatus.APPROVED,
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(DocumentStatus.APPROVED);
                expect(res.body.data.declineReason).toBe(null);
            });
    }, 20000);

    it('moves agent through reviewer statuses and validates rejection reason rule', async () => {
        await req()
            .post(`/agents/${agent.id}/update-status`)
            .set(auth())
            .send({
                status: AgentStatus.REJECTED,
                reviewerId: 1,
                comment: null,
            })
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
                expect(res.body.message).toBe(ErrorMessage.NO_REASON_DECLINE);
            });

        await req()
            .post(`/agents/${agent.id}/update-status`)
            .set(auth())
            .send({
                status: AgentStatus.REJECTED,
                reviewerId: 1,
                comment: 'Missing mandatory details',
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(AgentStatus.REJECTED);
            });

        updateAgentStatusDto = {
            status: AgentStatus.APPROVED,
            reviewerId: 1,
        };

        await req()
            .post(`/agents/${agent.id}/update-status`)
            .set(auth())
            .send(updateAgentStatusDto)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.status).toBe(AgentStatus.APPROVED);
            });
    }, 20000);

    it('creates a referral for a customer and verifies referree listing', async () => {
        customer = await userService.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            roles: [UserRole.USER],
        });

        const createReferralDto: CreateReferralDto = {
            referrerId: agent.id,
            referreeId: customer.id,
        };

        await req()
            .post('/referrals')
            .set(auth())
            .send(createReferralDto)
            .expect(HttpStatus.CREATED);

        await req()
            .get(`/agents/${agent.id}/referrees`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.items.length).toBeGreaterThan(0);
            });
    });

    it('posts commissions from referral code and validates totals and statuses', async () => {
        createCommissionDto = {
            referralCode: agent.referralCode,
            amount: 50000,
            userId: customer.id,
        };

        const firstCommissionRes = await req()
            .post('/commissions')
            .set(auth())
            .send(createCommissionDto)
            .expect(HttpStatus.CREATED);

        const secondCommissionRes = await req()
            .post('/commissions')
            .set(auth())
            .send(createCommissionDto)
            .expect(HttpStatus.CREATED);

        firstCommissionId = firstCommissionRes.body.data.id;

        totalCommissionFromPosts =
            Number(firstCommissionRes.body.data.amount) +
            Number(secondCommissionRes.body.data.amount);

        await req()
            .get(`/agents/${agent.id}/total-commission`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(Number(res.body.data)).toBe(totalCommissionFromPosts);
            });

        updateCommissionDto = {
            comment: 'The deal fell off',
            status: CommissionStatus.DECLINED,
        };

        await req()
            .patch(`/commissions/${firstCommissionId}`)
            .set(auth())
            .send({
                ...updateCommissionDto,
                comment: null,
            })
            .expect(HttpStatus.BAD_REQUEST)
            .expect((res) => {
                expect(res.body.message).toBe(ErrorMessage.NO_COMMENT_DECLINE);
            });

        await req()
            .patch(`/commissions/${firstCommissionId}`)
            .set(auth())
            .send(updateCommissionDto)
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.comment).toBe(updateCommissionDto.comment);
                expect(res.body.data.status).toBe(CommissionStatus.DECLINED);
            });

        await req()
            .patch(`/commissions/${firstCommissionId}`)
            .set(auth())
            .send({
                status: CommissionStatus.PAID,
            })
            .expect(HttpStatus.OK)
            .expect((res) => {
                expect(res.body.data.comment).toBe(null);
                expect(res.body.data.status).toBe(CommissionStatus.PAID);
            });
    });

    it('analytics endpoint returns correct dashboard metrics', async () => {
        await req()
            .get(`/analytics/agent/${agent.id}`)
            .set(auth())
            .expect(HttpStatus.OK)
            .expect((res) => {
                const metrics = res.body;
                expect(metrics).toHaveProperty('totalCustomers');
                expect(metrics).toHaveProperty('totalSalesCount');
                expect(metrics).toHaveProperty('totalSalesAmount');
                expect(metrics).toHaveProperty('totalAssetValue');
                expect(metrics).toHaveProperty('totalCommissions');
                expect(metrics).toHaveProperty('bonusTierProgress');

                // One customer was referred
                expect(metrics.totalCustomers).toBe(1);

                // Total commissions must match what was posted (both commissions are still in DB,
                // though first was declined then paid — the query sums all regardless of status)
                expect(Number(metrics.totalCommissions)).toBe(totalCommissionFromPosts);

                // Bonus tier progress shape
                expect(metrics.bonusTierProgress).toHaveProperty('currentTier');
                expect(metrics.bonusTierProgress).toHaveProperty('currentBonusRate');
                expect(metrics.bonusTierProgress).toHaveProperty('nextTierProgress');
            });
    });
});
