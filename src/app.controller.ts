import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResult, okResponse } from './common/common.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('test')
  async test(): Promise<ApiResult<any>> {
    return okResponse(
      {
        message: 'API is working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        nodeVersion: process.version,
      },
      'Test endpoint working',
    );
  }
}
