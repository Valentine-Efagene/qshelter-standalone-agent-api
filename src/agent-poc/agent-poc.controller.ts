import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CreateAgentPocDto, UpdateAgentPocDto } from './agent-poc.dto';
import { AgentPoc } from './agent-poc.entity';
import { AgentPocService } from './agent-poc.service';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResult, okResponse } from '../common/common.dto';
import { ResponseMessage } from '../common/common.enum';
import { AuthGuard } from '../common/auth/auth.guard';

@AuthGuard()
@Controller('agent-pocs')
@ApiTags('Agent Point of Contact')
@ApiResponse(OpenApiHelper.responseDoc)
export class AgentPocController {
  constructor(
    private readonly agentPocService: AgentPocService,
  ) { }

  @Post()
  async create(
    @Body() createDto: CreateAgentPocDto,
  ): Promise<ApiResult<AgentPoc>> {
    const data = await this.agentPocService.create(createDto);
    return okResponse(data, ResponseMessage.CREATED);
  }

  @Get()
  async findAll(): Promise<ApiResult<AgentPoc[]>> {
    const data = await this.agentPocService.findAll();
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<AgentPoc>> {
    const data = await this.agentPocService.findOne(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Patch(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAgentPocDto,
  ): Promise<ApiResult<AgentPoc>> {
    const data = await this.agentPocService.updateOne(id, updateDto);
    return okResponse(data, ResponseMessage.UPDATED);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResult<void>> {
    await this.agentPocService.remove(id);
    return okResponse(null, ResponseMessage.DELETED);
  }
}
