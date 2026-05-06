import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentTypeService } from './agent-type.service';
import { AgentTypeLookup } from './agent-type.entity';
import { AuthGuard } from '../common/auth/auth.guard';
import { ApiResult, okResponse } from '../common/common.dto';
import { ResponseMessage } from '../common/common.enum';

@AuthGuard()
@Controller('agent-types')
@ApiTags('Agent Types')
export class AgentTypeController {
    constructor(private readonly agentTypeService: AgentTypeService) { }

    @Get()
    async findAll(): Promise<ApiResult<AgentTypeLookup[]>> {
        const data = await this.agentTypeService.findAll();
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @Get(':code')
    async findOne(@Param('code') code: string): Promise<ApiResult<AgentTypeLookup>> {
        const data = await this.agentTypeService.findOneByCode(code);
        return okResponse(data, ResponseMessage.FETCHED);
    }
}
