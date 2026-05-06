import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentTypeLookup } from './agent-type.entity';

@Injectable()
export class AgentTypeService {
    constructor(
        @InjectRepository(AgentTypeLookup)
        private readonly agentTypeRepository: Repository<AgentTypeLookup>,
    ) { }

    findAll(): Promise<AgentTypeLookup[]> {
        return this.agentTypeRepository.find({ order: { name: 'ASC' } });
    }

    async findOneByCode(code: string): Promise<AgentTypeLookup> {
        const agentType = await this.agentTypeRepository.findOne({ where: { code } });
        if (!agentType) {
            throw new NotFoundException(`Agent type ${code} not found`);
        }
        return agentType;
    }
}
