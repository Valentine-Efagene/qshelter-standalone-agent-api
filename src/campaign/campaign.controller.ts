import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { AssignCampaignAgentsDto, CreateCampaignDto, UpdateCampaignDto, UpsertCampaignRateDto } from './campaign.dto';
import { ApiResult, okResponse } from '../common/common.dto';
import { ResponseMessage } from '../common/common.enum';
import { Campaign } from './campaign.entity';
import { CampaignAgentTypeRate } from './campaign-agent-type-rate.entity';
import { AuthGuard } from '../common/auth/auth.guard';

@AuthGuard()
@Controller('campaigns')
@ApiTags('Campaigns')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }

    @Post()
    async create(@Body() dto: CreateCampaignDto): Promise<ApiResult<Campaign>> {
        const data = await this.campaignService.create(dto);
        return okResponse(data, ResponseMessage.CREATED);
    }

    @Get()
    async findAll(): Promise<ApiResult<Campaign[]>> {
        const data = await this.campaignService.findAll();
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResult<Campaign>> {
        const data = await this.campaignService.findOne(id);
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCampaignDto,
    ): Promise<ApiResult<Campaign>> {
        const data = await this.campaignService.update(id, dto);
        return okResponse(data, ResponseMessage.UPDATED);
    }

    @Post(':id/agents')
    async assignAgents(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AssignCampaignAgentsDto,
    ): Promise<ApiResult<Campaign>> {
        const data = await this.campaignService.assignAgents(id, dto);
        return okResponse(data, ResponseMessage.UPDATED);
    }

    @Delete(':id/agents/:agentId')
    async removeAgent(
        @Param('id', ParseIntPipe) id: number,
        @Param('agentId', ParseIntPipe) agentId: number,
    ): Promise<ApiResult<null>> {
        await this.campaignService.removeAgent(id, agentId);
        return okResponse(null, ResponseMessage.DELETED);
    }

    @Put(':id/rates/:agentTypeCode')
    async upsertRate(
        @Param('id', ParseIntPipe) id: number,
        @Param('agentTypeCode') agentTypeCode: string,
        @Body() dto: UpsertCampaignRateDto,
    ): Promise<ApiResult<CampaignAgentTypeRate>> {
        const data = await this.campaignService.upsertRate(id, agentTypeCode, dto);
        return okResponse(data, ResponseMessage.UPDATED);
    }
}
