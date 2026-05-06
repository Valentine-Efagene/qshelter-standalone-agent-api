import { Controller } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import OpenApiHelper from '../common/OpenApiHelper';
import { AuthGuard } from './auth/auth.guard';

@AuthGuard()
@Controller('common')
@ApiTags('Common')
@ApiResponse(OpenApiHelper.responseDoc)
export class CommonController {
  constructor() { }
}
