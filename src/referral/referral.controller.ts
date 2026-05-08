import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { Referral } from './referral.entity';
import { ReferralService } from './referral.service';
import { CreateReferralDto, ReferralPaginationDto } from './referral.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/common.enum';
import { AuthGuard } from '../common/auth/auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { Paginated } from '../common/common.dto';
import { User } from '../user/user.entity';
import { Request } from 'express';

@AuthGuard()
@Controller('referrals')
@ApiTags('Referral')
@ApiResponse(OpenApiHelper.responseDoc)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) { }

  @Post()
  async create(
    @Body() createReferralDto: CreateReferralDto,
    @Req() request: Request,
  ): Promise<ApiResult<Referral>> {
    const data = await this.referralService.create(createReferralDto, request);
    return okResponse(data, ResponseMessage.CREATED);
  }

  @Get()
  @ApiResponse(OpenApiHelper.paginatedResponseDoc)
  async findAllPaginated(
    @Query() query: ReferralPaginationDto,
  ): Promise<ApiResult<Paginated<Referral>>> {
    const data = await this.referralService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  // @Get('by-agent/:id/paginate')
  // @ApiResponse(OpenApiHelper.arrayResponseDoc)
  // async findAllByAgentPaginated(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Paginate() query: PaginateQuery,
  // ): Promise<ApiResult<Paginated<User>>> {
  //   const data = await this.referralService.findAllPaginatedByAgent(query, id);
  //   return new StandardApiResponse(
  //     HttpStatus.OK,
  //     ResponseMessage.FETCHED,
  //     data,
  //   );
  // }

  @Get('by-agent/:id/referrees')
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllByAgent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<User[]>> {
    const data = await this.referralService.getAllReferreesByAgent(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  @ApiResponse(OpenApiHelper.responseDoc)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<Referral>> {
    const data = await this.referralService.findOne(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  // @Delete(':id')
  // @ApiHeader(OpenApiHelper.referralIdHeader)
  // //@Roles([ReferralRole.ADMIN])
  // @ApiOperation({ summary: '', tags: ['Admin'] })
  // @ApiResponse(OpenApiHelper.nullResponseDoc)
  // async remove(
  //   @Param('id', ParseIntPipe) id: number): Promise<ApiResult<void>> {
  //   await this.referralService.remove(id);
  //   return okResponse(null, ResponseMessage.DELETED);
  // }
}
