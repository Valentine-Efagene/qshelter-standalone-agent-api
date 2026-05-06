import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Query,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { Agent } from './agent.entity';
import { AgentService } from './agent.service';
import { AgentPaginationDto, CreateAgentDto, ReferreePaginationDto, UpdateAgentDto, UpdateAgentStatusDto } from './agent.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/common.enum';
import { AuthGuard } from '../common/auth/auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse, Paginated } from '../common/common.dto';
import { PaginatedUsers } from '../user/user.dto';
import { AgentCommissionPaginationDto, PaginatedCommissions } from '../commission/commission.dto';
import { AgentDocument } from '../agent-document/agent-document.entity';
import { AgentIdValidationPipe } from '../common/pipes/agent-id-validation.pipe';
import { Request } from 'express';

@AuthGuard()
@Controller('agents')
@ApiTags('Agent')
@ApiResponse(OpenApiHelper.responseDoc)
export class AgentController {
  constructor(private readonly agentService: AgentService) { }

  @Post()
  async create(
    @Body() createAgentDto: CreateAgentDto,
    @Req() request: Request,
  ): Promise<ApiResult<Agent>> {
    const data = await this.agentService.create(createAgentDto, request);
    return okResponse(data, ResponseMessage.CREATED);
  }

  // @Get()
  // @ApiResponse(OpenApiHelper.arrayResponseDoc)
  // async findAll(): Promise<ApiResult<Agent[]>> {
  //   const data = await this.agentService.findAll();
  //   return okResponse(data, ResponseMessage.FETCHED);
  // }

  @Get('paginate')
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllPaginated(
    @Query() query: AgentPaginationDto,
  ): Promise<ApiResult<Paginated<Agent>>> {
    const data = await this.agentService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id/referrees')
  @ApiResponse(OpenApiHelper.responseDoc)
  async getReferrees(
    @Param('id', AgentIdValidationPipe) id: number,
    @Query() query: ReferreePaginationDto,
  ): Promise<ApiResult<PaginatedUsers>> {
    const data = await this.agentService.getReferrees(query, id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id/agent-documents')
  @ApiResponse(OpenApiHelper.responseDoc)
  async findAllAgentDocuments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<AgentDocument[]>> {
    const data = await this.agentService.findAgentDocumentsByAgentId(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id/commissions')
  @ApiResponse(OpenApiHelper.responseDoc)
  async getCommissions(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AgentCommissionPaginationDto,
  ): Promise<ApiResult<PaginatedCommissions>> {
    const data = await this.agentService.getCommissions(query, id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id/total-commission')
  @ApiResponse(OpenApiHelper.responseDoc)
  async getTotalCommission(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<number>> {
    const data = await this.agentService.getTotalCommission(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  @ApiResponse(OpenApiHelper.responseDoc)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<Agent>> {
    const data = await this.agentService.findOne(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }
  @Get('by-referral-code/:code')
  async findOneByReferralCode(
    @Param('code') code: string,
  ): Promise<ApiResult<Agent>> {
    const data = await this.agentService.findOneByReferralCode(code);
    return okResponse(data, ResponseMessage.FETCHED);
  }
  @Get('by-user/:id')
  async findOneByUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<Agent>> {
    const data = await this.agentService.findOneByUser(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/update-status')
  //@Roles([UserRole.ADMIN])
  @ApiOperation({ summary: '', tags: ['Admin'] })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAgentStatusDto,
    @Req() request: Request,
  ): Promise<ApiResult<Agent>> {
    const data = await this.agentService.updateStatus(
      id,
      updateDto,
      request
    );

    return okResponse(data, ResponseMessage.UPDATED);
  }

  @Patch(':id')
  @ApiResponse(OpenApiHelper.responseDoc)
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgentDto,
  ): Promise<ApiResult<Agent>> {
    const data = await this.agentService.updateOne({ id, ...dto });
    return okResponse(data, ResponseMessage.FETCHED);
  }

  // @Delete(':id')
  // //@Roles([AgentRole.ADMIN])
  // @ApiOperation({ summary: '', tags: ['Admin'] })
  // @ApiResponse(OpenApiHelper.nullResponseDoc)
  // async remove(
  //   @Param('id', ParseIntPipe) id: number): Promise<ApiResult<void>> {
  //   await this.agentService.remove(id);
  //   return okResponse(null, ResponseMessage.DELETED);
  // }
}
