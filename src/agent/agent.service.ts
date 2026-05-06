import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AgentPaginationDto, CreateAgentDto, PaginatedAgents, ReferreePaginationDto, UpdateAgentStatusDto } from './agent.dto';
import { Agent } from './agent.entity';
import { UpdateAgentDto } from './agent.dto';
import { Paginated, PaginationArgs, buildPaginatedResult } from '../common/common.dto';
import CryptographyHelper from '../common/helpers/CryptographyHelper';
import { CommissionService } from '../commission/commission.service';
import { LicensingInfo } from '../licensing-info/licensing-info.entity';
import { AgentDocument } from '../agent-document/agent-document.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PaginatedUsers } from '../user/user.dto';
import { AgentCommissionPaginationDto, PaginatedAgentCommissions } from '../commission/commission.dto';
import { AgentDocumentService } from '../agent-document/agent-document.service';
import {
  AgentStatus,
  ADMIN_ONLY_STATUSES,
  TERMINAL_STATUSES,
  AgentType,
} from './agent.enums';
import { ErrorMessage } from '../common/common.enum';
import { AgentApprovedRegistrationDto, AgentOnboardingCompletedDto } from '../notification/notification.dto';
import { App } from '../notification/notification.enums';
import TypeHelper from '../common/helpers/TypeHelper';
import { NotificationService } from '../notification/notification.service';
import EnvironmentHelper from '../common/helpers/EnvironmentHelper';
import { Request } from 'express';
import { AgentPoc } from '../agent-poc/agent-poc.entity';
import { LicensingRegulatoryBody } from '../licensing-info/licensing-info.enums';

// https://www.npmjs.com/package/nestjs-paginate
@Injectable()
export class AgentService {
  private app: App
  private readonly logger = new Logger(AgentService.name);

  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    private readonly commissionService: CommissionService,
    private readonly userService: UserService,
    private readonly agentDocumentService: AgentDocumentService,
    private readonly notificationService: NotificationService,
    private dataSource: DataSource,
  ) {
    this.app = TypeHelper.toEnum(App, process.env.APP)
  }

  private ensureElitePartnerLicensingRequirements(
    licensingInfoDto: CreateAgentDto['licensingInfo'],
  ): void {
    if (!licensingInfoDto?.length) {
      throw new BadRequestException('Elite Partner onboarding requires CAC certificate upload');
    }

    const hasCacCertificate = licensingInfoDto.some((doc) => {
      return doc.regulatoryBody === LicensingRegulatoryBody.CAC_CERTIFICATE;
    });

    if (!hasCacCertificate) {
      throw new BadRequestException('CAC certificate is required for Elite Partner onboarding');
    }

    const hasInvalidDocument = licensingInfoDto.some((doc) => !doc.url);
    if (hasInvalidDocument) {
      throw new BadRequestException('Each licensing document must include a url');
    }
  }

  private async validateApprovalReadiness(agentId: number, agentType: AgentType): Promise<void> {
    const licensingInfoRows = await this.dataSource.getRepository(LicensingInfo).find({
      where: { agentId },
    });

    if (agentType === AgentType.ELITE_PARTNER) {
      const hasCacCertificate = licensingInfoRows.some((info) =>
        info.regulatoryBody === LicensingRegulatoryBody.CAC_CERTIFICATE ||
        (info.regulatoryBody || '').toUpperCase().includes('CAC'),
      );

      if (!hasCacCertificate) {
        throw new BadRequestException('Elite Partner application cannot be approved without CAC certificate');
      }
    }
  }

  async create(createAgentDto: CreateAgentDto, request: Request): Promise<Agent> {
    const { licensingInfo: licensingInfoDto, poc, ...rest } = createAgentDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.dataSource
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.id = :id', { id: createAgentDto.userId })
      .getOne();

    if (!user) {
      throw new BadRequestException(`User with ID ${createAgentDto.userId} not found`);
    }

    const referralCode = CryptographyHelper.generateReferralCode(user.email, user, 5);

    if (createAgentDto.agentType === AgentType.ELITE_PARTNER) {
      this.ensureElitePartnerLicensingRequirements(licensingInfoDto);
    }

    try {
      const agent = new Agent({
        ...rest,
        referralCode,
      })
      await queryRunner.manager.save(agent)

      if (licensingInfoDto) {
        const promises = [];

        for (const doc of licensingInfoDto) {
          const licensingInfo = new LicensingInfo();
          licensingInfo.agentId = agent.id;
          licensingInfo.regulatoryBody = doc.regulatoryBody;
          const persistedInfo = await queryRunner.manager.save(licensingInfo);

          const document = new AgentDocument();
          document.name = doc.regulatoryBody;
          document.url = doc.url;
          document.licensingInfoId = persistedInfo.id;
          promises.push(queryRunner.manager.save(document));
        }

        await Promise.all(promises);
      }

      if (poc) {
        const entity = new AgentPoc();
        Object.assign(entity, {
          ...poc,
          agentId: agent.id
        })
        await queryRunner.manager.save(entity);
      }

      await queryRunner.commitTransaction();
      const response: Agent = await this.agentRepository.findOne({
        where: {
          id: agent.id,
        },
        relations: ['poc', 'licensingInfo']
      })

      try {
        const emailDto: AgentOnboardingCompletedDto = {
          firstName: user.firstName,
          app: this.app,
          to_email: user.email,
        };
        await this.notificationService.sendAgentOnboardingCompleted(emailDto, request);
      } catch (error) {
        console.log('Error sending notification email:', error);
      }

      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find();
  }

  async findAgentDocumentsByAgentId(agentId: number): Promise<AgentDocument[]> {
    return this.agentDocumentService.findAllByAgent(agentId);
  }

  async findAllPaginated(query: AgentPaginationDto): Promise<Paginated<Agent>> {
    const { page = 1, limit = 20, status, agentType, from, to } = query;
    const skip = (page - 1) * limit;

    const qb = this.agentRepository.createQueryBuilder('agent')
      .orderBy('agent.createdAt', 'DESC');

    if (status) qb.andWhere('agent.status = :status', { status });
    if (agentType) qb.andWhere('agent.agentType = :agentType', { agentType });
    if (from) qb.andWhere('agent.createdAt >= :from', { from: new Date(from) });
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      qb.andWhere('agent.createdAt <= :to', { to: toDate });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return buildPaginatedResult(data, total, query);
  }

  // findAllReferreesPaginated(query: PaginateQuery, agentId: number): Promise<Paginated<User>> {
  //   return this.referralService.findAllPaginatedByAgent(query, agentId);
  // }

  async getReferreesByAgent(agentId: number): Promise<User[]> {
    const agent = this.agentRepository.findOne({
      where: { id: agentId },
      relations: ['referrals'],
    });

    return await this.agentRepository
      .createQueryBuilder('agent')
      .leftJoin('agent.referrals', 'referral') // Join referrals table
      .leftJoinAndSelect('referral.referree', 'referree') // Join and select referees (users)
      .where('agent.id = :agentId', { agentId }) // Filter by agentId
      .select(['referree.id', 'referree.name', 'referree.email']) // Select required fields from the User entity
      .getMany() as unknown as Promise<User[]>;
  }

  async findOne(id: number): Promise<Agent> {
    const agent = this.agentRepository.findOne({
      where: { id },
      relations: ['licensingInfo', 'poc'],
    });

    if (!agent) {
      throw new NotFoundException(`${Agent.name} with ID ${id} not found`);
    }

    return agent;
  }

  async findOneByUser(id: number): Promise<Agent> {
    const agent = this.agentRepository.findOne({
      where: {
        user: { id },
      },
      relations: ['licensingInfo', 'poc'],
    });
    return agent;
  }

  async findOneByReferralCode(referralCode: string): Promise<Agent> {
    const agent = this.agentRepository.findOne({
      where: {
        referralCode,
      },
    });
    return agent;
  }

  async updateStatus(
    id: number,
    updateDto: UpdateAgentStatusDto,
    request: Request
  ): Promise<Agent> {
    if (!ADMIN_ONLY_STATUSES.has(updateDto.status)) {
      throw new BadRequestException('Only APPROVED or REJECTED statuses are allowed on this endpoint');
    }

    if (
      updateDto.status === AgentStatus.REJECTED &&
      !updateDto.comment
    ) {
      throw new BadRequestException(ErrorMessage.NO_REASON_DECLINE);
    }

    if (updateDto.status !== AgentStatus.REJECTED) {
      updateDto.comment = null
    }

    const agent = await this.agentRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!agent) {
      throw new NotFoundException(
        `${Agent.name} with ID ${id} not found`,
      );
    }

    if (TERMINAL_STATUSES.has(agent.status)) {
      throw new BadRequestException(`Cannot update status from terminal state ${agent.status}`);
    }

    if (updateDto.status === AgentStatus.APPROVED && agent.status !== AgentStatus.SUBMITTED) {
      throw new BadRequestException('Agent can only be approved after reaching SUBMITTED status');
    }

    if (updateDto.status === AgentStatus.APPROVED) {
      await this.validateApprovalReadiness(agent.id, agent.agentType);
    }

    const { reviewerId, ...rest } = updateDto;

    this.agentRepository.merge(agent, {
      ...rest,
      reviewer: { id: reviewerId },
      reviewedAt: new Date().toISOString(),
    });

    const res = await this.agentRepository.save(agent);

    const emailDto: AgentApprovedRegistrationDto = {
      firstName: agent.user.firstName,
      app: this.app,
      to_email: agent.user.email,
      loginLink: EnvironmentHelper.env.AGENT_DASHBOARD_URL
    };

    try {
      if (updateDto.status === AgentStatus.APPROVED) {
        await this.notificationService.sendAgentApplicationApproved(emailDto, request);
      } else if (updateDto.status === AgentStatus.REJECTED) {
        await this.notificationService.sendAgentApplicationDeclined({
          ...emailDto,
          reason: updateDto.comment
        }, request);
      }
    } catch (error) {
      this.logger.error('Error sending notification email:', error);
    }

    return res;
  }

  async updateOne({ id, ...updateAgentDto }: UpdateAgentDto): Promise<Agent> {
    const agent = await this.agentRepository.findOneBy({ id });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    this.agentRepository.merge(agent, updateAgentDto);
    return this.agentRepository.save(agent);
  }

  async getCommissions(query: AgentCommissionPaginationDto, agentId: number): Promise<PaginatedAgentCommissions> {
    return this.commissionService.paginateAgentCommissions(query, agentId);
  }

  async getReferrees(query: ReferreePaginationDto, agentId: number): Promise<PaginatedUsers> {
    return this.userService.paginateAgentReferrees(query, agentId);
  }

  async getTotalCommission(agentId: number): Promise<number> {
    return this.commissionService.getTotalCommissionForAgent(agentId);
  }

  async remove(id: number): Promise<void> {
    await this.agentRepository.delete(id);
  }

  async paginate(query: PaginationArgs): Promise<PaginatedAgents> {
    const [data, count] = await this.agentRepository.findAndCount({
      skip: query.page > 0 ? query.page - 1 : 1,
      take: query.limit,
    });

    return {
      data,
      meta: {
        currentPage: query.page,
        itemsPerPage: query?.limit,
        totalItems: data.length,
        totalPages: Math.ceil(count / query.limit),
      },
    };
  }
}
