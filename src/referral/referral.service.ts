import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReferralDto, PaginatedReferrals, ReferralPaginationDto } from './referral.dto';
import { Referral } from './referral.entity';
import { UpdateReferralDto } from './referral.dto';
import { Paginated, PaginationArgs, buildPaginatedResult } from '../common/common.dto';
import { User } from '../user/user.entity';

// https://www.npmjs.com/package/nestjs-paginate
@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
  ) { }

  async create(createReferralDto: CreateReferralDto): Promise<Referral> {
    const { referreeId, referrerId, ...rest } = createReferralDto;

    const entity = this.referralRepository.create({
      referree: { id: referreeId },
      referrer: { id: referrerId },
      ...rest,
    });

    return this.referralRepository.save(entity);
  }

  async findAll(): Promise<Referral[]> {
    return this.referralRepository.find();
  }

  async findReferral(userId: number, referralCode: string): Promise<Referral> {
    const referral = await this.referralRepository
      .createQueryBuilder('referral')
      .leftJoin('referral.referrer', 'agent')
      .leftJoin('referral.referree', 'user')
      .where('agent.referralCode = :referralCode', { referralCode })
      .andWhere('user.id = :userId', { userId })
      .select('referral.id', 'referralId')
      .getRawOne();

    return referral
  }

  async findAllPaginated(query: ReferralPaginationDto): Promise<Paginated<Referral>> {
    const { page = 1, limit = 20, from, to, referrerId } = query;
    const skip = (page - 1) * limit;

    const qb = this.referralRepository.createQueryBuilder('referral')
      .leftJoinAndSelect('referral.referree', 'referree')
      .leftJoinAndSelect('referral.referrer', 'referrer')
      .orderBy('referral.createdAt', 'DESC');

    if (referrerId) qb.andWhere('referral.referrerId = :referrerId', { referrerId });
    if (from) qb.andWhere('referral.createdAt >= :from', { from: new Date(from) });
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      qb.andWhere('referral.createdAt <= :to', { to: toDate });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return buildPaginatedResult(data, total, query);
  }

  // findAllPaginatedByAgent(query: PaginateQuery, agentId: number): Promise<Paginated<User>> {
  //   return paginate(query, this.referralRepository, {
  //     where: {
  //       referrerId: agentId
  //     },
  //     sortableColumns: ['id', 'createdAt', 'updatedAt'],
  //     //nullSort: 'last',
  //     defaultSortBy: [['id', 'DESC']],
  //     searchableColumns: ['referree.firstName', 'referree.lastName', 'referree.email'],
  //     // loadEagerRelations: true,
  //     relations: ['referree'],
  //     //select: ['id'],
  //     filterableColumns: {
  //       //name: [FilterOperator.EQ, FilterSuffix.NOT],
  //       //age: true,
  //     },
  //   }) as unknown as Promise<Paginated<User>>;
  // }

  async getAllReferreesByAgent(agentId: number): Promise<User[]> {
    return this.referralRepository
      .createQueryBuilder('referral')
      .leftJoinAndSelect('referral.referree', 'referree') // Join referree (user)
      .where('referral.referrerId = :agentId', { agentId }) // Filter by agentId
      .select(['referree.id', 'referree.firstName', 'referree.lastName', 'referree.email']) // Select only referree fields
      .getMany()
      .then(referrals => {
        return referrals.map(referral => referral.referree)
      }); // Directly return the referree objects
  }


  async findOne(id: number): Promise<Referral> {
    const referral = this.referralRepository.findOne({
      where: { id },
      relations: [],
    });

    if (!referral) {
      throw new NotFoundException(`${Referral.name} with ID ${id} not found`);
    }

    return referral;
  }

  async updateOne({
    id,
    ...updateReferralDto
  }: UpdateReferralDto): Promise<Referral> {
    const referral = await this.referralRepository.findOneBy({ id });

    if (!referral) {
      throw new NotFoundException(`Referral with ID ${id} not found`);
    }

    this.referralRepository.merge(referral, updateReferralDto);
    return this.referralRepository.save(referral);
  }

  // async deleteAllChildrenGroupEntities(referralId: number): Promise<void> {
  //   await this.referralRepository
  //     .createQueryBuilder()
  //     .delete()
  //     .from(GroupEntity)
  //     .where('referral_id = :referralId', { referralId })
  //     .execute();
  // }

  async remove(id: number): Promise<void> {
    await this.referralRepository.delete(id);
  }

  async paginate(query: PaginationArgs): Promise<PaginatedReferrals> {
    const [data, count] = await this.referralRepository.findAndCount({
      skip: query.page > 0 ? query.page - 1 : 1,
      take: query.limit,
      relations: ['referrer', 'referree', 'referrer.user', 'commissions'],
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
