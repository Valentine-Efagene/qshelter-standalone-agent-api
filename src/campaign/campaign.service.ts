import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { CampaignAgent } from './campaign-agent.entity';
import { CampaignAgentTypeRate } from './campaign-agent-type-rate.entity';
import { Agent } from '../agent/agent.entity';
import { AgentTypeService } from '../agent-type/agent-type.service';
import { AssignCampaignAgentsDto, CreateCampaignDto, UpdateCampaignDto, UpsertCampaignRateDto } from './campaign.dto';

@Injectable()
export class CampaignService {
    constructor(
        @InjectRepository(Campaign)
        private readonly campaignRepository: Repository<Campaign>,
        @InjectRepository(CampaignAgent)
        private readonly campaignAgentRepository: Repository<CampaignAgent>,
        @InjectRepository(CampaignAgentTypeRate)
        private readonly campaignRateRepository: Repository<CampaignAgentTypeRate>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        private readonly agentTypeService: AgentTypeService,
        private readonly dataSource: DataSource,
    ) { }

    private normalizeWindow(startsAt?: string, endsAt?: string): { startsAt: Date | null; endsAt: Date | null } {
        const normalizedStartsAt = startsAt ? new Date(startsAt) : null;
        const normalizedEndsAt = endsAt ? new Date(endsAt) : null;

        if (normalizedStartsAt && normalizedEndsAt && normalizedStartsAt > normalizedEndsAt) {
            throw new BadRequestException('Campaign startsAt must be before endsAt');
        }

        return { startsAt: normalizedStartsAt, endsAt: normalizedEndsAt };
    }

    private async assertAgentsExist(agentIds: number[]): Promise<void> {
        if (!agentIds.length) {
            return;
        }

        const count = await this.agentRepository.count({ where: agentIds.map((id) => ({ id })) });
        if (count !== new Set(agentIds).size) {
            throw new BadRequestException('One or more agents were not found');
        }
    }

    private async createRates(
        campaignId: number,
        rates: CreateCampaignDto['rates'] = [],
        repository: Repository<CampaignAgentTypeRate>,
    ): Promise<void> {
        if (!rates?.length) {
            return;
        }

        for (const rate of rates) {
            await this.agentTypeService.findOneByCode(rate.agentTypeCode);
        }

        const entities = rates.map((rate) =>
            repository.create({
                campaignId,
                agentTypeCode: rate.agentTypeCode,
                commissionRate: rate.commissionRate,
            }),
        );

        await repository.save(entities);
    }

    private async createAssignments(
        campaignId: number,
        agentIds: number[] = [],
        repository: Repository<CampaignAgent>,
    ): Promise<void> {
        if (!agentIds?.length) {
            return;
        }

        await this.assertAgentsExist(agentIds);

        const uniqueAgentIds = [...new Set(agentIds)];
        const entities = uniqueAgentIds.map((agentId) =>
            repository.create({
                campaignId,
                agentId,
            }),
        );

        await repository.save(entities);
    }

    async create(dto: CreateCampaignDto): Promise<Campaign> {
        const { startsAt, endsAt } = this.normalizeWindow(dto.startsAt, dto.endsAt);

        const campaign = await this.dataSource.transaction(async (manager) => {
            const campaignRepository = manager.getRepository(Campaign);
            const campaignAgentRepository = manager.getRepository(CampaignAgent);
            const campaignRateRepository = manager.getRepository(CampaignAgentTypeRate);

            const entity = campaignRepository.create({
                name: dto.name,
                description: dto.description,
                isActive: dto.isActive ?? true,
                priority: dto.priority ?? 0,
                startsAt,
                endsAt,
            });

            const savedCampaign = await campaignRepository.save(entity);
            await this.createAssignments(savedCampaign.id, dto.agentIds, campaignAgentRepository);
            await this.createRates(savedCampaign.id, dto.rates, campaignRateRepository);

            return savedCampaign;
        });

        return this.findOne(campaign.id);
    }

    findAll(): Promise<Campaign[]> {
        return this.campaignRepository.find({
            relations: ['agentAssignments', 'agentAssignments.agent', 'rates', 'commissions'],
            order: { priority: 'DESC', createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Campaign> {
        const campaign = await this.campaignRepository.findOne({
            where: { id },
            relations: ['agentAssignments', 'agentAssignments.agent', 'rates', 'commissions'],
        });

        if (!campaign) {
            throw new NotFoundException(`Campaign with ID ${id} not found`);
        }

        return campaign;
    }

    async update(id: number, dto: UpdateCampaignDto): Promise<Campaign> {
        const campaign = await this.findOne(id);
        const { startsAt, endsAt } = this.normalizeWindow(dto.startsAt, dto.endsAt);

        this.campaignRepository.merge(campaign, {
            ...(dto.name !== undefined ? { name: dto.name } : {}),
            ...(dto.description !== undefined ? { description: dto.description } : {}),
            ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
            ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
            ...(dto.startsAt !== undefined ? { startsAt } : {}),
            ...(dto.endsAt !== undefined ? { endsAt } : {}),
        });

        await this.campaignRepository.save(campaign);
        return this.findOne(id);
    }

    async assignAgents(campaignId: number, dto: AssignCampaignAgentsDto): Promise<Campaign> {
        await this.findOne(campaignId);
        await this.assertAgentsExist(dto.agentIds);

        const uniqueAgentIds = [...new Set(dto.agentIds)];
        const existingAssignments = await this.campaignAgentRepository.find({
            where: uniqueAgentIds.map((agentId) => ({ campaignId, agentId })),
        });
        const existingAgentIds = new Set(existingAssignments.map((assignment) => assignment.agentId));

        const newAssignments = uniqueAgentIds
            .filter((agentId) => !existingAgentIds.has(agentId))
            .map((agentId) =>
                this.campaignAgentRepository.create({
                    campaignId,
                    agentId,
                }),
            );

        if (newAssignments.length) {
            await this.campaignAgentRepository.save(newAssignments);
        }

        return this.findOne(campaignId);
    }

    async removeAgent(campaignId: number, agentId: number): Promise<void> {
        const result = await this.campaignAgentRepository.delete({ campaignId, agentId });
        if (!result.affected) {
            throw new NotFoundException(`Agent ${agentId} is not assigned to campaign ${campaignId}`);
        }
    }

    async upsertRate(campaignId: number, agentTypeCode: string, dto: UpsertCampaignRateDto): Promise<CampaignAgentTypeRate> {
        await this.findOne(campaignId);
        await this.agentTypeService.findOneByCode(agentTypeCode);

        const existing = await this.campaignRateRepository.findOne({ where: { campaignId, agentTypeCode } });
        if (existing) {
            existing.commissionRate = dto.commissionRate;
            return this.campaignRateRepository.save(existing);
        }

        const created = this.campaignRateRepository.create({
            campaignId,
            agentTypeCode,
            commissionRate: dto.commissionRate,
        });

        return this.campaignRateRepository.save(created);
    }

    async findApplicableCampaignForAgent(agentId: number, agentTypeCode: string): Promise<CampaignAgentTypeRate | null> {
        const now = new Date().toISOString();

        return this.campaignRateRepository
            .createQueryBuilder('rate')
            .innerJoinAndSelect('rate.campaign', 'campaign')
            .innerJoin('campaign.agentAssignments', 'assignment', 'assignment.agentId = :agentId', { agentId })
            .where('rate.agentTypeCode = :agentTypeCode', { agentTypeCode })
            .andWhere('campaign.isActive = true')
            .andWhere('(campaign.startsAt IS NULL OR campaign.startsAt <= :now)', { now })
            .andWhere('(campaign.endsAt IS NULL OR campaign.endsAt >= :now)', { now })
            .orderBy('campaign.priority', 'DESC')
            .addOrderBy('campaign.createdAt', 'DESC')
            .getOne();
    }
}
