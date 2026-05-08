import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import OpenApiHelper from '../common/OpenApiHelper';
import { ResponseMessage } from '../common/common.enum';
import { AuthGuard } from '../common/auth/auth.guard';
import { ApiResult, okResponse, Paginated } from '../common/common.dto';
import { CreatePayoutDto, PayoutPaginationDto, UpdatePayoutStatusDto } from './payout.dto';
import { Payout } from './payout.entity';
import { PayoutService } from './payout.service';

@AuthGuard()
@Controller('payouts')
@ApiTags('Payout')
@ApiResponse(OpenApiHelper.responseDoc)
export class PayoutController {
    constructor(private readonly payoutService: PayoutService) { }

    @Post()
    async create(
        @Body() createDto: CreatePayoutDto,
        @Req() request: Request,
    ): Promise<ApiResult<Payout>> {
        const data = await this.payoutService.create(createDto, request);
        return okResponse(data, ResponseMessage.CREATED);
    }

    @Get()
    @ApiResponse(OpenApiHelper.paginatedResponseDoc)
    async findAllPaginated(
        @Query() query: PayoutPaginationDto,
    ): Promise<ApiResult<Paginated<Payout>>> {
        const data = await this.payoutService.findAllPaginated(query);
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResult<Payout>> {
        const data = await this.payoutService.findOne(id);
        return okResponse(data, ResponseMessage.FETCHED);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdatePayoutStatusDto,
        @Req() request: Request,
    ): Promise<ApiResult<Payout>> {
        const data = await this.payoutService.updateStatus(id, updateDto, request);
        return okResponse(data, ResponseMessage.UPDATED);
    }
}
