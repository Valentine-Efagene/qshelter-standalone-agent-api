import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Req,
  HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AgentApprovedRegistrationDto } from './notification.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import OpenApiHelper from '../common/OpenApiHelper';
import { AuthGuard } from '../common/auth/auth.guard';
import { ApiResult, okResponse } from '../common/common.dto';
import { Request } from 'express';

@AuthGuard()
@Controller('notifications')
@ApiTags('Notification')
@ApiResponse(OpenApiHelper.responseDoc)
export class PropertyController {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('test-email')
  @ApiOperation({
    summary: 'Send test email',
    description: '',
  })
  async sendEmail(
    @Body() body: AgentApprovedRegistrationDto,
    @Req() request: Request
  ) {
    const response = await this.notificationService.sendAgentApplicationApproved(body, request);
    return okResponse(response, 'Sent');
  }
}
