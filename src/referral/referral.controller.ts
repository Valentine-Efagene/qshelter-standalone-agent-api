import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Referral } from './referral.entity';
import { ReferralService } from './referral.service';
import { CreateReferralDto } from './referral.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/common.enum';
import { SwaggerAuth } from '../common/guard/swagger-auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from '../user/user.entity';

@SwaggerAuth()
@Controller('referrals')
@ApiTags('Referral')
@ApiResponse(OpenApiHelper.responseDoc)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) { }

  @Post()
  async create(
    @Body() createReferralDto: CreateReferralDto,
  ): Promise<ApiResult<Referral>> {
    const data = await this.referralService.create(createReferralDto);
    return okResponse(data, ResponseMessage.CREATED);
  }

  @Get('paginate')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<ApiResult<Paginated<Referral>>> {
    const data = await this.referralService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  // @Get('by-agent/:id/paginate')
  // @ApiHeader(OpenApiHelper.userIdHeader)
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
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllByAgent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<User[]>> {
    const data = await this.referralService.getAllReferreesByAgent(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  @ApiHeader(OpenApiHelper.userIdHeader)
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
