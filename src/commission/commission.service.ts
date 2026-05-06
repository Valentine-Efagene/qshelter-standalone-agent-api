import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AgentConfigurationService } from '../agent-configuration/agent-configuration.service';
import { AgentCommissionPaginationDto, CommissionPaginationDto, CreateCommissionDto, Customer, PaginatedAgentCommissions, PaginatedCommissions, PostCommissionWithCodeDto, UpdateCommissionDto } from './commission.dto';
import { Commission } from './commission.entity';
import { Paginated, PaginationDto, buildPaginatedResult } from '../common/common.dto';
import { Referral } from '../referral/referral.entity';

// https://www.npmjs.com/package/nestjs-paginate
@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,

    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,

    private readonly configService: ConfigService,
    private readonly agentConfigurationService: AgentConfigurationService,
  ) { }

  async create(createCommissionDto: CreateCommissionDto): Promise<Commission> {
    const { referralId, ...rest } = createCommissionDto;

    const entity = this.commissionRepository.create({
      referral: { id: referralId },
      ...rest,
    });

    return this.commissionRepository.save(entity);
  }

  async postCommissionWithCode(createCommissionDto: PostCommissionWithCodeDto): Promise<Commission> {
    const { referralCode, userId, amount } = createCommissionDto;

    const referral = await this.referralRepository
      .createQueryBuilder('referral')
      .leftJoin('referral.referrer', 'agent')
      .leftJoin('referral.referree', 'user')
      .where('agent.referralCode = :referralCode', { referralCode })
      .andWhere('user.id = :userId', { userId })
      .select('referral.id', 'id')
      .addSelect('agent.agentType', 'agentType')
      .getRawOne();

    if (!referral.id) {
      throw new BadRequestException('Referral not found')
    }

    let commissionRate = Number(this.configService.get('COMMISSION_RATE') ?? 0.05);
    try {
      const config = await this.agentConfigurationService.findByAgentType(referral.agentType);
      commissionRate = Number(config.commissionRate);
    } catch {
      // fall back to env if no DB config seeded yet
    }

    const entity = this.commissionRepository.create({
      referral: { id: referral.id },
      amount: amount * commissionRate,
    });

    return this.commissionRepository.save(entity);
  }

  async findAll(): Promise<Commission[]> {
    return this.commissionRepository.find();
  }

  async getTotalCommissionForAgent(agentId: number): Promise<number> {
    const result = await this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoin('commission.referral', 'referral')
      .where('referral.referrerId = :agentId', { agentId })
      .select('SUM(commission.amount)', 'total')
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async findAllPaginated(query: CommissionPaginationDto): Promise<Paginated<Commission>> {
    const { page = 1, limit = 20, from, to, status, agentId } = query;
    const skip = (page - 1) * limit;

    const qb = this.commissionRepository.createQueryBuilder('commission')
      .leftJoin('commission.referral', 'referral')
      .orderBy('commission.createdAt', 'DESC');

    if (agentId) qb.andWhere('referral.referrerId = :agentId', { agentId });
    if (status) qb.andWhere('commission.status = :status', { status });
    if (from) qb.andWhere('commission.createdAt >= :from', { from: new Date(from) });
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      qb.andWhere('commission.createdAt <= :to', { to: toDate });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return buildPaginatedResult(data, total, query);
  }

  // async paginateAgentCommissions(query: PaginateQuery, agentId: number): Promise<Paginated<Commission>> {
  //   const queryBuilder = this.commissionRepository
  //     .createQueryBuilder('commission')
  //     .leftJoinAndSelect('commission.referral', 'referral')
  //     .leftJoinAndSelect('referral.referrer', 'agent')
  //     .where('referral.referrerId = :agentId', { agentId });

  //   return paginate(query, queryBuilder, {
  //     sortableColumns: ['id', 'createdAt'], // Specify columns you want to sort by
  //     defaultSortBy: [['createdAt', 'DESC']],
  //     searchableColumns: [], // Add searchable columns if needed
  //     maxLimit: 100,
  //   });
  // }


  async paginateAgentCommissions(query: AgentCommissionPaginationDto, agentId: number): Promise<PaginatedAgentCommissions> {
    const { page = 1, limit = 10, from, to, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.commissionRepository
      .createQueryBuilder('commission')
      .leftJoin('commission.referral', 'referral')
      .leftJoinAndSelect('referral.referree', 'user')
      .where('referral.referrerId = :agentId', { agentId })
      .orderBy('user.createdAt', 'DESC')  // Apply sorting

    if (from) {
      queryBuilder.andWhere('commission.createdAt >= :from', { from: new Date(from) });
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('commission.createdAt <= :to', { to: toDate });
    }
    if (status) {
      queryBuilder.andWhere('commission.status = :status', { status });
    }

    const { entities, raw } = await queryBuilder
      .limit(limit)
      .offset(skip)
      .getRawAndEntities()

    const totalItems = await queryBuilder.getCount()

    // Map the raw result to include the totalCommission
    const mappedResult = entities.map((commission: any, index) => {
      const _raw = (raw?.[index] as {
        user_id: number,
        user_first_name: string | null,
        user_last_name: string | null,
        user_avatar: string | null,
        user_phone: null,
        user_email: null,
      })

      const customer: Customer = {
        avatar: _raw.user_avatar,
        firstName: _raw.user_first_name,
        lastName: _raw.user_last_name,
        email: _raw.user_email,
        phone: _raw.user_phone,
        id: _raw.user_id
      }

      return {
        ...commission,
        customer,  // Ensure totalCommission is included
      }
    });

    const response = {
      data: mappedResult,
      meta: {
        itemsPerPage: query.limit,
        totalItems,
        currentPage: query.page,
        totalPages: Math.ceil(totalItems / limit)
      }
    }

    return response
  }

  async findOne(id: number): Promise<Commission> {
    const commission = this.commissionRepository.findOne({
      where: { id },
      relations: [
        //'commissionDirectors',
        //'groupEntities',
      ],
    });

    if (!commission) {
      throw new NotFoundException(`${Commission.name} with ID ${id} not found`);
    }

    return commission;
  }

  async findOneByUser(id: number): Promise<Commission> {
    const commission = this.commissionRepository.findOne({
      where: {
        referral: { id },
      },
      relations: [],
    });
    return commission;
  }

  async updateOne(id: number, updateCommissionDto: UpdateCommissionDto): Promise<Commission> {
    const commission = await this.commissionRepository.findOneBy({ id });

    if (!commission) {
      throw new NotFoundException(`Commission with ID ${id} not found`);
    }

    this.commissionRepository.merge(commission, updateCommissionDto);
    return this.commissionRepository.save(commission);
  }

  async remove(id: number): Promise<void> {
    await this.commissionRepository.delete(id);
  }

  async paginate(query: PaginationDto): Promise<PaginatedCommissions> {
    const [data, count] = await this.commissionRepository.findAndCount({
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
