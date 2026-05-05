import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/common.enum';
import { SwaggerAuth } from '../common/guard/swagger-auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@SwaggerAuth()
@Controller('users')
@ApiTags('User')
@ApiResponse(OpenApiHelper.responseDoc)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResult<User>> {
    const data = await this.userService.create(createUserDto);
    return okResponse(data, ResponseMessage.CREATED);
  }

  // @Get()
  // @ApiHeader(OpenApiHelper.userIdHeader)
  // @ApiResponse(OpenApiHelper.arrayResponseDoc)
  // async findAll(): Promise<ApiResult<User[]>> {
  //   const data = await this.userService.findAll();
  //   return okResponse(data, ResponseMessage.FETCHED);
  // }

  @Get('paginate')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<ApiResult<Paginated<User>>> {
    const data = await this.userService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  @ApiHeader(OpenApiHelper.userIdHeader)
  @ApiResponse(OpenApiHelper.responseDoc)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<User>> {
    const data = await this.userService.findOne(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  // @Delete(':id')
  // @ApiHeader(OpenApiHelper.userIdHeader)
  // //@Roles([UserRole.ADMIN])
  // @ApiOperation({ summary: '', tags: ['Admin'] })
  // @ApiResponse(OpenApiHelper.nullResponseDoc)
  // async remove(
  //   @Param('id', ParseIntPipe) id: number): Promise<ApiResult<void>> {
  //   await this.userService.remove(id);
  //   return okResponse(null, ResponseMessage.DELETED);
  // }
}
