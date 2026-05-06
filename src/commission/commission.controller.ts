import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
  Patch,
  BadRequestException,
  Delete,
  Query,
} from '@nestjs/common';
import { Commission } from './commission.entity';
import { CommissionService } from './commission.service';
import { CommissionPaginationDto, PostCommissionWithCodeDto, UpdateCommissionDto } from './commission.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorMessage, ResponseMessage } from '../common/common.enum';
import { SwaggerAuth } from '../common/guard/swagger-auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { Paginated } from '../common/common.dto';
import { CommissionStatus } from './commission.enums';

@SwaggerAuth()
@Controller('commissions')
@ApiTags('Commission')
@ApiResponse(OpenApiHelper.responseDoc)
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) { }

  // @Post()
  // async create(
  //   @Body() createCommissionDto: CreateCommissionDto,
  // ): Promise<ApiResult<Commission>> {
  //   const data = await this.commissionService.create(createCommissionDto);
  //   return new StandardApiResponse(
  //     HttpStatus.CREATED,
  //     ResponseMessage.CREATED,
  //     data,
  //   );
  // }

  @Post()
  async create(
    @Body() createCommissionDto: PostCommissionWithCodeDto,
  ): Promise<ApiResult<Commission>> {
    const data = await this.commissionService.postCommissionWithCode(createCommissionDto);
    return okResponse(data, ResponseMessage.CREATED);
  }

  // @Get()
  // @ApiHeader(OpenApiHelper.userIdHeader)
  // @ApiResponse(OpenApiHelper.arrayResponseDoc)
  // async findAll(): Promise<ApiResult<Commission[]>> {
  //   const data = await this.commissionService.findAll();
  //   return okResponse(data, ResponseMessage.FETCHED);
  // }

  @Get('paginate')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllPaginated(
    @Query() query: CommissionPaginationDto,
  ): Promise<ApiResult<Paginated<Commission>>> {
    const data = await this.commissionService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.responseDoc)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<Commission>> {
    const data = await this.commissionService.findOne(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Patch(':id')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.responseDoc)
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommissionDto
  ): Promise<ApiResult<Commission>> {
    if (dto.status && dto.status === CommissionStatus.DECLINED && (!dto.comment || dto.comment.length < 1)) {
      throw new BadRequestException(ErrorMessage.NO_COMMENT_DECLINE)
    }

    if (dto.status && dto.status !== CommissionStatus.DECLINED) {
      dto.comment = null
    }

    const data = await this.commissionService.updateOne(id, dto);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Delete(':id')
  @ApiHeader(OpenApiHelper.userIdHeader)
  //@Roles([CommissionRole.ADMIN])
  @ApiOperation({ summary: '', tags: ['Admin'] })
  @ApiResponse(OpenApiHelper.nullResponseDoc)
  async remove(
    @Param('id', ParseIntPipe) id: number): Promise<ApiResult<void>> {
    await this.commissionService.remove(id);
    return okResponse(null, ResponseMessage.DELETED);
  }
}
