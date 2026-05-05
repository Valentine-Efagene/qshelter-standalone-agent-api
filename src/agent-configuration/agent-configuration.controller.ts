import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentConfigurationService } from './agent-configuration.service';
import { UpdateAgentConfigurationDto } from './agent-configuration.dto';
import { AgentConfiguration } from './agent-configuration.entity';
import { AgentType } from '../agent/agent.enums';

@ApiTags('Agent Configuration')
@Controller('agent-configurations')
export class AgentConfigurationController {
    constructor(private readonly agentConfigurationService: AgentConfigurationService) { }

    @Get()
    findAll(): Promise<AgentConfiguration[]> {
        return this.agentConfigurationService.findAll();
    }

    @Get(':agentType')
    findOne(@Param('agentType') agentType: AgentType): Promise<AgentConfiguration> {
        return this.agentConfigurationService.findByAgentType(agentType);
    }

    @Put(':agentType')
    upsert(
        @Param('agentType') agentType: AgentType,
        @Body() dto: UpdateAgentConfigurationDto,
    ): Promise<AgentConfiguration> {
        return this.agentConfigurationService.upsert(agentType, dto);
    }
}
