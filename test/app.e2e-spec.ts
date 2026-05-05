import * as dotenv from 'dotenv'

dotenv.config({ path: '.test.env' })

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
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
import { Status } from '../src/common/common.type';
import { NotificationService } from '../src/notification/notification.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let s3UploaderService: S3UploaderService;
  let userService: UserService;
  let createAgentDto: CreateAgentDto
  let agent: Agent
  let agentUser: User
  let customer: User
  let updateCommissionDto: UpdateCommissionDto
  let createCommissionDto: PostCommissionWithCodeDto
  let updateLicensingDocumentStatusDto: UpdateLicensingDocumentStatusDto
  let updateAgentStatusDto: UpdateAgentStatusDto
  let updateLicensingDocumentDto: UpdateLicensingDocumentDto
  let notificationService: NotificationService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable ValidationPipe globally for testing
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    userService = moduleFixture.get<UserService>(UserService);
    s3UploaderService = moduleFixture.get<S3UploaderService>(S3UploaderService);
    notificationService = moduleFixture.get<NotificationService>(NotificationService);

    const notificationResponse = {
      "message": "Sent",
      "statusCode": 200,
      "data": {
        "message": "Enqueued",
        "statusCode": 200,
        "success": true,
        "data": {
          "$metadata": {
            "httpStatusCode": 200,
            "requestId": "de606e01-0c88-5de8-846a-319c85358361",
            "attempts": 1,
            "totalRetryDelay": 0
          },
          "MD5OfMessageBody": "9bb462e740d8bc307405f8918c732211",
          "MessageId": "dd742f94-9fb9-4f5a-9b19-1df2fddac6b3"
        }
      }
    }

    // Comment out to receive emails
    jest.spyOn(notificationService, 'sendEmail').mockImplementation(async () => Promise.resolve(notificationResponse));

    // Mock the deleteFromS3 method to return a resolved promise (Make it a no-op, since it returns void)
    jest.spyOn(s3UploaderService, 'deleteFromS3').mockImplementation(async () => Promise.resolve());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates agent', async () => {
    const createUserDto = DataEntry.createUserDto
    agentUser = await userService.create(createUserDto)
    createAgentDto = DataEntry.buildCreateAgentDto(agentUser.id)

    await request(app.getHttpServer())
      .post('/agents')
      .send(createAgentDto)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        agent = res.body.data as Agent
        expect(agent.id).toBe(1);
        expect(agent.title).toBe(createAgentDto.title);
        expect(agent.name).toBe(createAgentDto.name);
        expect(agent.agentType).toBe(createAgentDto.agentType);
        expect(agent.poc.email).toBe(createAgentDto.poc.email);
        expect(res.body.statusCode).toBe(201);
      })
      .expect(201);
  })

  it('retrieves agent by ID', async () => {
    await request(app.getHttpServer())
      .get(`/agents/${agent.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.name).toBe(createAgentDto.name)
        expect(res.body.statusCode).toBe(200);
      })
  })

  it("retrieves agent's licensing documents", async () => {
    await request(app.getHttpServer())
      .get(`/agents/${agent.id}/licensing-documents`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.length).toBe(1)
        expect(res.body.statusCode).toBe(200);
      })
  })

  it('retrieves one licensing document', async () => {
    await request(app.getHttpServer())
      .get(`/licensing-documents/1`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.status).toBe(DocumentStatus.PENDING)
        expect(res.body.statusCode).toBe(200);
      })
  })

  it('reupload licensing document', async () => {
    // Get the number of documents before reupload
    const documentsBefore = await request(app.getHttpServer())
      .get(`/agents/${agent.id}/licensing-documents`)
      .expect(200);
    const documentCountBefore = documentsBefore.body.data.length;

    updateLicensingDocumentDto = {
      url: 'https://chatgpt.com/',
      name: 'New Name'
    }

    await request(app.getHttpServer())
      .patch(`/licensing-documents/1`)
      .send(updateLicensingDocumentDto)
      .expect(200)
      .expect(res => {
        expect(res.body.data.url).toBe(updateLicensingDocumentDto.url)
        expect(res.body.data.name).toBe(updateLicensingDocumentDto.name)
        expect(res.body.statusCode).toBe(200);
      })

    // Verify that the agent status was returned to PENDING
    await request(app.getHttpServer())
      .get(`/agents/${agent.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.status).toBe(Status.PENDING);
      })

    // Verify that the number of documents is the same (no duplicates)
    await request(app.getHttpServer())
      .get(`/agents/${agent.id}/licensing-documents`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.length).toBe(documentCountBefore);
      })
  })

  it('approve one licensing document', async () => {
    updateLicensingDocumentStatusDto = {
      status: DocumentStatus.APPROVED,
      reviewerId: 1
    }

    await request(app.getHttpServer())
      .post(`/licensing-documents/1/update-status`)
      .send(updateLicensingDocumentStatusDto)
      .expect(200)
      .expect(res => {
        expect(res.body.data.status).toBe(DocumentStatus.APPROVED)
        expect(res.body.statusCode).toBe(200);
      })
  }, 20000)

  it('decline one licensing document', async () => {
    await request(app.getHttpServer())
      .post(`/licensing-documents/1/update-status`)
      .send({
        ...updateLicensingDocumentStatusDto,
        status: DocumentStatus.DECLINED,
        declineReason: 'Malformed document'
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.status).toBe(DocumentStatus.DECLINED)
        expect(res.body.data.declineReason).toBe('Malformed document')
        expect(res.body.statusCode).toBe(200);
      })
  }, 20000)

  it('approve one licensing document', async () => {
    await request(app.getHttpServer())
      .post(`/licensing-documents/1/update-status`)
      .send({
        ...updateLicensingDocumentStatusDto,
        status: DocumentStatus.APPROVED,
        declineReason: 'Malformed document'
      })
      .expect(res => {
        expect(res.body.data.status).toBe(DocumentStatus.APPROVED)
        expect(res.body.data.declineReason).toBe(null)
        expect(res.body.statusCode).toBe(200);
      })
  })

  it('cannot decline a licensing document without reason', async () => {
    await request(app.getHttpServer())
      .post(`/licensing-documents/1/update-status`)
      .send({
        ...updateLicensingDocumentStatusDto,
        status: DocumentStatus.DECLINED,
        declineReason: null
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessage.NO_REASON_DECLINE)
        expect(res.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
      })
  })

  it('get agent by user ID', async () => {
    await request(app.getHttpServer())
      .get(`/agents/by-user/${agentUser.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.name).toBe(createAgentDto.name)
        expect(res.body.statusCode).toBe(200);
      })
  })

  it('cannot decline agent without reason', async () => {
    updateAgentStatusDto = {
      status: Status.APPROVED,
      reviewerId: 1
    }
    await request(app.getHttpServer())
      .post(`/agents/${agent.id}/update-status`)
      .send({
        ...updateLicensingDocumentStatusDto,
        status: Status.APPROVED,
        declineReason: 'Malformed document'
      })
      .expect(res => {
        expect(res.body.statusCode).toBe(200);
      })
      .expect(200)
  })

  it('decline agent', async () => {
    const declineAgentStatusDto: UpdateAgentStatusDto = {
      status: Status.DECLINED,
      reviewerId: 1,
      comment: 'Malformed document'
    }
    await request(app.getHttpServer())
      .post(`/agents/${agent.id}/update-status`)
      .send(declineAgentStatusDto)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.status).toBe(declineAgentStatusDto.status)
        expect(res.body.data.comment).toBe(declineAgentStatusDto.comment)
        expect(res.body.statusCode).toBe(200);
      })
  }, 20000)

  it('approve agent', async () => {
    updateAgentStatusDto = {
      status: Status.APPROVED,
      reviewerId: 1
    }
    await request(app.getHttpServer())
      .post(`/agents/${agent.id}/update-status`)
      .send({
        ...updateLicensingDocumentStatusDto,
        status: Status.APPROVED,
      })
      .expect(200)
      .expect(res => {
        const resAgent = res.body.data as Agent
        expect(resAgent.status).toBe(Status.APPROVED)
        expect(resAgent.comment).toBeFalsy()
        expect(res.body.statusCode).toBe(200);
      })
  }, 20000)

  it('get agent by referral code', async () => {
    await request(app.getHttpServer())
      .get(`/agents/by-referral-code/${agent.referralCode}`)
      .expect(200)
      .expect(res => {
        expect(res.body.data.name).toBe(createAgentDto.name)
        expect(res.body.statusCode).toBe(200);
      })
  })

  it('create referral relationship between a user and an agent', async () => {
    customer = await userService.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      roles: [UserRole.USER]
    })

    const createReferralDto: CreateReferralDto = {
      referrerId: 1,
      referreeId: customer.id
    }

    await request(app.getHttpServer())
      .post('/referrals')
      .send(createReferralDto)
      .expect(HttpStatus.CREATED)
  })

  it('get all referrees of an agent', async () => {
    await request(app.getHttpServer())
      .get(`/agents/${agent.id}/referrees`)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.data.length).toBe(1)
      })
  })

  it('post commissions', async () => {
    createCommissionDto = {
      referralCode: agent.referralCode,
      amount: 50000,
      userId: customer.id
    }

    await request(app.getHttpServer())
      .post('/commissions')
      .send(createCommissionDto)
      .expect(HttpStatus.CREATED)

    await request(app.getHttpServer())
      .post('/commissions')
      .send(createCommissionDto)
      .expect(HttpStatus.CREATED)
  })

  it('computes total commission for an agent', async () => {
    await request(app.getHttpServer())
      .get(`/agents/${agent.id}/total-commission`)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data).toBe(createCommissionDto.amount * 2)
      })

    updateCommissionDto = {
      comment: 'The deal fell off',
      status: CommissionStatus.DECLINED
    }
  })

  it('cannot decline commission without comment', async () => {
    await request(app.getHttpServer())
      .patch(`/commissions/${1}`)
      .send({
        ...updateCommissionDto,
        comment: null
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect(res => {
        expect(res.body.message).toBe(ErrorMessage.NO_COMMENT_DECLINE)
      })
  })

  it('decline commission with comment', async () => {
    await request(app.getHttpServer())
      .patch(`/commissions/${1}`)
      .send(updateCommissionDto)
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.comment).toBe(updateCommissionDto.comment)
        expect(res.body.data.status).toBe(CommissionStatus.DECLINED)
      })
  })

  it('approve commission payment', async () => {
    await request(app.getHttpServer())
      .patch(`/commissions/${1}`)
      .send({
        status: CommissionStatus.PAID
      })
      .expect(HttpStatus.OK)
      .expect(res => {
        expect(res.body.data.comment).toBe(null)
        expect(res.body.data.status).toBe(CommissionStatus.PAID)
      })
  });
});
