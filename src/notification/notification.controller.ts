import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Req,
  HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  AgentApprovedRegistrationDto,
  AgentAccountApprovedDto,
  AgentAccountRejectedDto,
  AgentAccountSuspensionDto,
  AgentBankDetailsUpdateDto,
  AgentBonusEarnedDto,
  AgentCommissionEarnedDto,
  AgentCustomerStartedApplicationDto,
  AgentPasswordChangeConfirmationDto,
  AgentPasswordResetRequestDto,
  AgentPayoutApprovedDto,
  AgentPayoutRejectedDto,
  AgentPayoutRequestReceivedDto,
  AgentProfileSubmissionDto,
  AgentVerifyDto,
  AgentWelcomeDto,
} from './notification.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import OpenApiHelper from '../common/OpenApiHelper';
import { AuthGuard } from '../common/auth/auth.guard';
import { ApiResult, okResponse } from '../common/common.dto';
import { Request } from 'express';

@AuthGuard()
@Controller()
@ApiTags('Notification')
@ApiResponse(OpenApiHelper.responseDoc)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('notifications/test-email')
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

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/account-approved')
  @ApiOperation({ summary: 'Relay account approved email' })
  async sendAgentAccountApproved(
    @Body() body: AgentAccountApprovedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentAccountApproved(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/account-rejected')
  @ApiOperation({ summary: 'Relay account rejected email' })
  async sendAgentAccountRejected(
    @Body() body: AgentAccountRejectedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentAccountRejected(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/account-suspension')
  @ApiOperation({ summary: 'Relay account suspension email' })
  async sendAgentAccountSuspension(
    @Body() body: AgentAccountSuspensionDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentAccountSuspension(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/bank-details-update')
  @ApiOperation({ summary: 'Relay bank details update email' })
  async sendAgentBankDetailsUpdate(
    @Body() body: AgentBankDetailsUpdateDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentBankDetailsUpdate(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/bonus-earned')
  @ApiOperation({ summary: 'Relay bonus earned email' })
  async sendAgentBonusEarned(
    @Body() body: AgentBonusEarnedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentBonusEarned(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/commission-earned')
  @ApiOperation({ summary: 'Relay commission earned email' })
  async sendAgentCommissionEarned(
    @Body() body: AgentCommissionEarnedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentCommissionEarned(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/customer-started-application')
  @ApiOperation({ summary: 'Relay customer started application email' })
  async sendAgentCustomerStartedApplication(
    @Body() body: AgentCustomerStartedApplicationDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentCustomerStartedApplication(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/password-change-confirmation')
  @ApiOperation({ summary: 'Relay password change confirmation email' })
  async sendAgentPasswordChangeConfirmation(
    @Body() body: AgentPasswordChangeConfirmationDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentPasswordChangeConfirmation(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/password-reset-request')
  @ApiOperation({ summary: 'Relay password reset request email' })
  async sendAgentPasswordResetRequest(
    @Body() body: AgentPasswordResetRequestDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentPasswordResetRequest(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/payout-approved')
  @ApiOperation({ summary: 'Relay payout approved email' })
  async sendAgentPayoutApproved(
    @Body() body: AgentPayoutApprovedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentPayoutApproved(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/payout-rejected')
  @ApiOperation({ summary: 'Relay payout rejected email' })
  async sendAgentPayoutRejected(
    @Body() body: AgentPayoutRejectedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentPayoutRejected(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/payout-request-received')
  @ApiOperation({ summary: 'Relay payout request received email' })
  async sendAgentPayoutRequestReceived(
    @Body() body: AgentPayoutRequestReceivedDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentPayoutRequestReceived(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/profile-submission')
  @ApiOperation({ summary: 'Relay profile submission email' })
  async sendAgentProfileSubmission(
    @Body() body: AgentProfileSubmissionDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentProfileSubmission(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/verify')
  @ApiOperation({ summary: 'Relay verify email' })
  async sendAgentVerify(
    @Body() body: AgentVerifyDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentVerify(body, request);
    return okResponse(response, 'Sent');
  }

  @HttpCode(HttpStatus.OK)
  @Post('email/agent/welcome')
  @ApiOperation({ summary: 'Relay welcome email' })
  async sendAgentWelcome(
    @Body() body: AgentWelcomeDto,
    @Req() request: Request,
  ): Promise<ApiResult<unknown>> {
    const response = await this.notificationService.sendAgentWelcome(body, request);
    return okResponse(response, 'Sent');
  }
}
