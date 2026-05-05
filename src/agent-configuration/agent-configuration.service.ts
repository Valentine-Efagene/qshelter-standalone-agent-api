import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentConfiguration } from './agent-configuration.entity';
import { UpdateAgentConfigurationDto } from './agent-configuration.dto';
import { AgentType } from '../agent/agent.enums';

@Injectable()
export class AgentConfigurationService {
    constructor(
        @InjectRepository(AgentConfiguration)
        private readonly configRepository: Repository<AgentConfiguration>,
    ) { }

    findAll(): Promise<AgentConfiguration[]> {
        return this.configRepository.find();
    }

    async findByAgentType(agentType: AgentType): Promise<AgentConfiguration> {
        const config = await this.configRepository.findOne({ where: { agentType } });
        if (!config) {
            throw new NotFoundException(`Configuration for agent type ${agentType} not found`);
        }
        return config;
    }

    async upsert(agentType: AgentType, dto: UpdateAgentConfigurationDto): Promise<AgentConfiguration> {
        const existing = await this.configRepository.findOne({ where: { agentType } });
        if (existing) {
            Object.assign(existing, dto);
            return this.configRepository.save(existing);
        }
        const created = this.configRepository.create({ agentType, ...dto });
        return this.configRepository.save(created);
    }

    /**
     * Compute the bonus rate for a given agent type based on total property value sold.
     * Returns 0 if no tier threshold is met.
     */
    async computeBonusRate(agentType: AgentType, totalPropertyValueSold: number): Promise<number> {
        const config = await this.findByAgentType(agentType);
        if (totalPropertyValueSold >= Number(config.bonusTier2Threshold)) {
            return Number(config.bonusTier2Rate);
        }
        if (totalPropertyValueSold >= Number(config.bonusTier1Threshold)) {
            return Number(config.bonusTier1Rate);
        }
        return 0;
    }
}
