import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'express';
import { Agent } from '../agent/agent.entity';
import { App } from '../notification/notification.enums';
import TypeHelper from '../common/helpers/TypeHelper';
import { NotificationService } from '../notification/notification.service';
import { AgentPayoutApprovedDto, AgentPayoutRejectedDto, AgentPayoutRequestReceivedDto } from '../notification/notification.dto';
import { Paginated, buildPaginatedResult } from '../common/common.dto';
import { CreatePayoutDto, PayoutPaginationDto, UpdatePayoutStatusDto } from './payout.dto';
import { Payout } from './payout.entity';
import { PayoutStatus } from './payout.enums';
import { PayoutStatusReviewHistory } from './payout-status-review-history.entity';

@Injectable()
export class PayoutService {
    private readonly logger = new Logger(PayoutService.name);
    private readonly app: App;

    constructor(
        @InjectRepository(Payout)
        private readonly payoutRepository: Repository<Payout>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        private readonly notificationService: NotificationService,
        private readonly dataSource: DataSource,
    ) {
        this.app = TypeHelper.toEnum(App, process.env.APP);
    }

    async create(createDto: CreatePayoutDto, request: Request): Promise<Payout> {
        const agent = await this.agentRepository.findOne({
            where: { id: createDto.agentId },
            relations: ['user'],
        });

        if (!agent) {
            throw new NotFoundException(`Agent with ID ${createDto.agentId} not found`);
        }

        const entity = this.payoutRepository.create({
            agent: { id: createDto.agentId },
            amount: createDto.amount,
            status: PayoutStatus.PENDING,
        });

        const payout = await this.payoutRepository.save(entity);

        if (agent.user?.email) {
            try {
                const notificationDto: AgentPayoutRequestReceivedDto = {
                    agentName: agent.name,
                    app: this.app,
                    to_email: agent.user.email,
                };
                await this.notificationService.sendAgentPayoutRequestReceived(notificationDto, request);
            } catch (error) {
                this.logger.error('Error sending payout request received notification:', error);
            }
        }

        return payout;
    }

    async findAllPaginated(query: PayoutPaginationDto): Promise<Paginated<Payout>> {
        const { page = 1, limit = 20, status, agentId, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.payoutRepository
            .createQueryBuilder('payout')
            .leftJoinAndSelect('payout.agent', 'agent')
            .leftJoinAndSelect('payout.reviewer', 'reviewer')
            .orderBy('payout.createdAt', 'DESC');

        if (status) qb.andWhere('payout.status = :status', { status });
        if (agentId) qb.andWhere('payout.agentId = :agentId', { agentId });
        if (from) qb.andWhere('payout.createdAt >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('payout.createdAt <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }

    async findOne(id: number): Promise<Payout> {
        const payout = await this.payoutRepository.findOne({
            where: { id },
            relations: ['agent', 'reviewer'],
        });

        if (!payout) {
            throw new NotFoundException(`Payout with ID ${id} not found`);
        }

        return payout;
    }

    async updateStatus(id: number, updateDto: UpdatePayoutStatusDto, request: Request): Promise<Payout> {
        if (updateDto.status === PayoutStatus.REJECTED && !updateDto.rejectionReason) {
            throw new BadRequestException('Please provide a reason for rejecting this payout request');
        }

        const payout = await this.payoutRepository.findOne({
            where: { id },
            relations: ['agent', 'agent.user'],
        });

        if (!payout) {
            throw new NotFoundException(`Payout with ID ${id} not found`);
        }

        const previousStatus = payout.status;
        const reviewedAt = new Date().toISOString();

        const savedPayout = await this.dataSource.transaction(async (manager) => {
            const txPayoutRepo = manager.getRepository(Payout);
            const txHistoryRepo = manager.getRepository(PayoutStatusReviewHistory);

            txPayoutRepo.merge(payout, {
                status: updateDto.status,
                reviewer: { id: updateDto.reviewerId },
                reviewedAt,
                rejectionReason: updateDto.status === PayoutStatus.REJECTED ? updateDto.rejectionReason : null,
            });

            const updatedPayout = await txPayoutRepo.save(payout);

            const history = txHistoryRepo.create({
                payoutId: updatedPayout.id,
                reviewerId: updateDto.reviewerId,
                fromStatus: previousStatus,
                toStatus: updateDto.status,
                comment: updateDto.rejectionReason ?? null,
                reviewedAt,
            });

            await txHistoryRepo.save(history);
            return updatedPayout;
        });

        if (savedPayout.agent?.user?.email) {
            try {
                const amount = savedPayout.amount.toLocaleString('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                });

                if (savedPayout.status === PayoutStatus.APPROVED) {
                    const approvedDto: AgentPayoutApprovedDto = {
                        agentName: savedPayout.agent.name,
                        amount,
                        app: this.app,
                        to_email: savedPayout.agent.user.email,
                    };
                    await this.notificationService.sendAgentPayoutApproved(approvedDto, request);
                }

                if (savedPayout.status === PayoutStatus.REJECTED) {
                    const rejectedDto: AgentPayoutRejectedDto = {
                        agentName: savedPayout.agent.name,
                        rejectionReason: savedPayout.rejectionReason,
                        app: this.app,
                        to_email: savedPayout.agent.user.email,
                    };
                    await this.notificationService.sendAgentPayoutRejected(rejectedDto, request);
                }
            } catch (error) {
                this.logger.error('Error sending payout status notification:', error);
            }
        }

        return savedPayout;
    }
}
