import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { LicensingInfo } from './licensing-info.entity';
import { LicensingInfoService } from './licensing-info.service';
import {
  CreateLicensingInfoControllerDto,
  UpdateLicensingInfoDto,
} from './licensing-info.dto';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from '../common/common.enum';
import { SwaggerAuth } from '../common/guard/swagger-auth.guard';
import OpenApiHelper from '../common/helpers/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@SwaggerAuth()
@Controller('licensing-infos')
@ApiTags('Licensing Infos')
@ApiResponse(OpenApiHelper.responseDoc)
export class LicensingInfoController {
  constructor(
    private readonly licensingInfoService: LicensingInfoService,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create licensing info',
    description: '',
  })
  async create(
    @Body() dto: CreateLicensingInfoControllerDto,
  ): Promise<ApiResult<LicensingInfo>> {

    const data = await this.licensingInfoService.create(dto);

    return okResponse(data, ResponseMessage.CREATED);
  }

  @Get('paginate')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<ApiResult<Paginated<LicensingInfo>>> {
    const data = await this.licensingInfoService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Patch(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLicensingInfoDto,
  ): Promise<ApiResult<LicensingInfo>> {
    const data = await this.licensingInfoService.reupload(id, updateDto);
    return okResponse(data, ResponseMessage.UPDATED);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<void>> {
    await this.licensingInfoService.remove(id);

    return okResponse(null, ResponseMessage.DELETED);
  }
}
