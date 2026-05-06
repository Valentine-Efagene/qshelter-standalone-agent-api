import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto, UserPaginationDto } from './user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/common.enum';
import { AuthGuard } from '../common/auth/auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { Paginated } from '../common/common.dto';

@AuthGuard()
@Controller('users')
@ApiTags('User')
@ApiResponse(OpenApiHelper.responseDoc)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResult<User>> {
    const data = await this.userService.create(createUserDto);
    return okResponse(data, ResponseMessage.CREATED);
  }

  // @Get()
  // @ApiResponse(OpenApiHelper.arrayResponseDoc)
  // async findAll(): Promise<ApiResult<User[]>> {
  //   const data = await this.userService.findAll();
  //   return okResponse(data, ResponseMessage.FETCHED);
  // }

  @Get('paginate')
  @ApiResponse(OpenApiHelper.arrayResponseDoc)
  async findAllPaginated(
    @Query() query: UserPaginationDto,
  ): Promise<ApiResult<Paginated<User>>> {
    const data = await this.userService.findAllPaginated(query);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  @Get(':id')
  @ApiResponse(OpenApiHelper.responseDoc)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResult<User>> {
    const data = await this.userService.findOne(id);
    return okResponse(data, ResponseMessage.FETCHED);
  }

  // @Delete(':id')
  // //@Roles([UserRole.ADMIN])
  // @ApiOperation({ summary: '', tags: ['Admin'] })
  // @ApiResponse(OpenApiHelper.nullResponseDoc)
  // async remove(
  //   @Param('id', ParseIntPipe) id: number): Promise<ApiResult<void>> {
  //   await this.userService.remove(id);
  //   return okResponse(null, ResponseMessage.DELETED);
  // }
}
