import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentDocument } from './agent-document.entity';
import {
  CreateAgentDocumentDto,
  UpdateAgentDocumentDto,
  UpdateAgentDocumentStatusDto,
} from './agent-document.dto';
import { DocumentStatus, ErrorMessage } from '../common/common.enum';
import { Agent } from '../agent/agent.entity';
import { AgentStatus } from '../agent/agent.enums';

@Injectable()
export class AgentDocumentService {
  constructor(
    @InjectRepository(AgentDocument)
    private readonly agentDocumentRepository: Repository<AgentDocument>,
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
  ) { }

  async create(
    createAgentDocumentDto: CreateAgentDocumentDto,
  ): Promise<AgentDocument> {
    const { licensingInfoId, ...rest } = createAgentDocumentDto;
    return this.agentDocumentRepository.save({
      licensingInfo: { id: licensingInfoId },
      ...rest,
    });
  }

  async findAll(): Promise<AgentDocument[]> {
    return this.agentDocumentRepository.find();
  }

  async findAllByAgent(agentId: number): Promise<AgentDocument[]> {
    return await this.agentDocumentRepository
      .createQueryBuilder('agentDocument')
      .leftJoin('agentDocument.licensingInfo', 'licensingInfo')
      .leftJoin('licensingInfo.agent', 'agent')
      .where('agent.id = :agentId', { agentId })
      .getMany();
  }

  async findAllByUser(userId: number): Promise<AgentDocument[]> {
    return await this.agentDocumentRepository
      .createQueryBuilder()
      .where('user_id = :userId', { userId })
      .getMany();
  }

  findOne(id: number): Promise<AgentDocument> {
    return this.agentDocumentRepository.findOneBy({ id });
  }

  async updateOne(
    id: number,
    updateDto: UpdateAgentDocumentDto & { size?: number; url?: string },
  ): Promise<AgentDocument> {
    const agentDocument = await this.agentDocumentRepository.findOne({
      where: { id },
      relations: { licensingInfo: true },
    });

    if (!agentDocument) {
      throw new NotFoundException(
        `${AgentDocument.name} with ID ${id} not found`,
      );
    }

    this.agentDocumentRepository.merge(agentDocument, {
      ...updateDto,
      status: DocumentStatus.PENDING,
    });

    const agentId = agentDocument.licensingInfo.agentId;
    // Return agent to pendings if document is reuploaded
    const agent = await this.agentRepository.findOneBy({ id: agentId });

    if (!agent) {
      throw new NotFoundException(`${Agent.name} with ID ${agentId} not found`);
    }

    if (agent.status !== AgentStatus.DOCUMENTS_UPLOADED) {
      this.agentRepository.merge(agent, { status: AgentStatus.DOCUMENTS_UPLOADED });
      await this.agentRepository.save(agent);
    }

    return this.agentDocumentRepository.save(agentDocument);
  }

  async remove(id: number): Promise<void> {
    const document = await this.agentDocumentRepository.findOneBy({ id });

    await this.agentDocumentRepository.delete(document.id);
  }

  async updateStatus(
    id: number,
    updateDto: UpdateAgentDocumentStatusDto,
  ): Promise<AgentDocument> {
    if (
      updateDto.status === DocumentStatus.DECLINED &&
      !updateDto.declineReason
    ) {
      throw new BadRequestException(ErrorMessage.NO_REASON_DECLINE);
    }

    if (updateDto.status !== DocumentStatus.DECLINED) {
      updateDto.declineReason = null
    }

    const agentDocument = await this.agentDocumentRepository.findOneBy({
      id,
    });

    if (!agentDocument) {
      throw new NotFoundException(
        `${AgentDocument.name} with ID ${id} not found`,
      );
    }

    const { reviewerId, ...rest } = updateDto;

    this.agentDocumentRepository.merge(agentDocument, {
      ...rest,
      reviewer: { id: reviewerId },
      reviewedAt: new Date().toISOString(),
    });
    return this.agentDocumentRepository.save(agentDocument);
  }

  async reupload(
    id: number,
    dto: UpdateAgentDocumentDto,
  ): Promise<AgentDocument> {
    return await this.updateOne(id, dto);
  }
}
