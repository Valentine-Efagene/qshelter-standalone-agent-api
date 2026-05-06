import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateLicensingInfoDto, LicensingInfoPaginationDto } from './licensing-info.dto';
import { LicensingInfo } from './licensing-info.entity';
import { UpdateLicensingInfoDto } from './licensing-info.dto';
import { Paginated, buildPaginatedResult } from '../common/common.dto';
import { AgentDocument } from '../agent-document/agent-document.entity';
import { DocumentStatus } from '../common/common.enum';
import { Agent } from '../agent/agent.entity';
import { AgentStatus } from '../agent/agent.enums';

// https://www.npmjs.com/package/nestjs-paginate
@Injectable()
export class LicensingInfoService {
  constructor(
    @InjectRepository(LicensingInfo)
    private readonly licensingInfoRepository: Repository<LicensingInfo>,
    private dataSource: DataSource,
  ) { }

  async create(dto: CreateLicensingInfoDto): Promise<LicensingInfo> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const licensingInfo = new LicensingInfo();
      licensingInfo.agentId = dto.agentId;
      licensingInfo.regulatoryBody = dto.regulatoryBody;
      const persistedInfo = await queryRunner.manager.save(licensingInfo);

      const document = new AgentDocument();
      document.name = dto.regulatoryBody;
      document.url = dto.url;
      document.licensingInfoId = persistedInfo.id;
      await queryRunner.manager.save(document);

      await queryRunner.commitTransaction();
      return persistedInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<LicensingInfo[]> {
    return this.licensingInfoRepository.find();
  }

  async findAllPaginated(query: LicensingInfoPaginationDto): Promise<Paginated<LicensingInfo>> {
    const { page = 1, limit = 20, from, to, agentId } = query;
    const skip = (page - 1) * limit;

    const qb = this.licensingInfoRepository.createQueryBuilder('info')
      .orderBy('info.createdAt', 'DESC');

    if (agentId) qb.andWhere('info.agentId = :agentId', { agentId });
    if (from) qb.andWhere('info.createdAt >= :from', { from: new Date(from) });
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      qb.andWhere('info.createdAt <= :to', { to: toDate });
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return buildPaginatedResult(data, total, query);
  }

  async findOne(id: number): Promise<LicensingInfo> {
    const licensingInfo = await this.licensingInfoRepository.findOne({
      where: { id },
      relations: [
        'agent',
        'agentDocuments',
      ],
    });

    if (!licensingInfo) {
      throw new NotFoundException(
        `${LicensingInfo.name} with ID ${id} not found`,
      );
    }

    return licensingInfo;
  }

  async findOneByUser(id: number): Promise<LicensingInfo> {
    const licensingInfo = await this.licensingInfoRepository
      .createQueryBuilder('licensingInfo')
      .innerJoinAndSelect('licensingInfo.agent', 'agent')
      .innerJoinAndSelect('agent.user', 'user')
      .where('user.id = :userId', { userId: id })
      .getOne();

    return licensingInfo;
  }

  async updateOne(
    id: number,
    updateLicensingInfoDto: UpdateLicensingInfoDto & {
      size?: number;
      url?: string;
    },
  ): Promise<LicensingInfo> {
    const licensingInfo = await this.licensingInfoRepository.findOne({
      where: { id },
      relations: ['agentDocuments'],
    });

    if (!licensingInfo) {
      throw new NotFoundException(`LicensingInfo with ID ${id} not found`);
    }

    if (!updateLicensingInfoDto.url && !updateLicensingInfoDto.regulatoryBody) {
      throw new BadRequestException('Provide at least one field to update: url or regulatoryBody');
    }

    this.licensingInfoRepository.merge(licensingInfo, updateLicensingInfoDto);

    const primaryDocument = licensingInfo.agentDocuments?.[0];
    if (primaryDocument) {
      if (updateLicensingInfoDto.url) {
        primaryDocument.url = updateLicensingInfoDto.url;
      }

      if (updateLicensingInfoDto.regulatoryBody) {
        primaryDocument.name = updateLicensingInfoDto.regulatoryBody;
      }

      primaryDocument.status = DocumentStatus.PENDING;
      primaryDocument.declineReason = null;
      primaryDocument.reviewedAt = null;
      primaryDocument.reviewer = null;
      await this.dataSource.getRepository(AgentDocument).save(primaryDocument);
    } else if (updateLicensingInfoDto.url) {
      const document = new AgentDocument();
      document.name = updateLicensingInfoDto.regulatoryBody || licensingInfo.regulatoryBody;
      document.url = updateLicensingInfoDto.url;
      document.licensingInfoId = licensingInfo.id;
      document.status = DocumentStatus.PENDING;
      await this.dataSource.getRepository(AgentDocument).save(document);
    }

    const agent = await this.dataSource.getRepository(Agent).findOneBy({ id: licensingInfo.agentId });
    if (agent && agent.status !== AgentStatus.DOCUMENTS_UPLOADED) {
      agent.status = AgentStatus.DOCUMENTS_UPLOADED;
      await this.dataSource.getRepository(Agent).save(agent);
    }

    return this.licensingInfoRepository.save(licensingInfo);
  }

  async reupload(
    id: number,
    dto: UpdateLicensingInfoDto,
  ): Promise<LicensingInfo> {
    return await this.updateOne(id, dto);
  }

  // async deleteAllChildrenGroupEntities(licensingInfoId: number): Promise<void> {
  //   await this.licensingInfoRepository
  //     .createQueryBuilder()
  //     .delete()
  //     .from(GroupEntity)
  //     .where('licensingInfo_id = :licensingInfoId', { licensingInfoId })
  //     .execute();
  // }

  async remove(id: number): Promise<void> {
    await this.licensingInfoRepository.delete(id);
  }
}
