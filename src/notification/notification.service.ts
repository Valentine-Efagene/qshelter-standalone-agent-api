import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { AuthHelper } from '../common/auth/auth.helper';
import {
  AgentApprovedRegistrationDto,
  AgentDeclinedRegistrationDto,
  AgentOnboardingCompletedDto,
  INotificationResponse,
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
  BaseTemplateEmailDto,
} from './notification.dto';
import EnvironmentHelper from '../common/helpers/EnvironmentHelper';
import { HttpService } from '@nestjs/axios';
import ErrorHelper from '../common/helpers/ErrorHelper';

@Injectable()
export class NotificationService {
  baseUrl: string

  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly httpService: HttpService
  ) {
    this.baseUrl = EnvironmentHelper.env.NOTIFICATION_URL
  }

  private buildUrl(route: string): string {
    return `${this.baseUrl.replace(/\/+$/, '')}/${route.replace(/^\/+/, '')}`;
  }

  async sendEmail(emailDto: unknown, endpoint: string, request: Request): Promise<INotificationResponse> {
    if (!this.baseUrl) {
      throw new InternalServerErrorException('Notification endpoint not set')
    }

    const { data } = await firstValueFrom(
      this.httpService.post(endpoint, emailDto, {
        headers: {
          Authorization: AuthHelper.getAuthorizationHeader(request),
        }
      })
        .pipe(catchError((error: AxiosError) => {
          throw ErrorHelper.appropriateError(error)
        }))
    )

    return data
  }

  async sendAgentTemplateEmail(dto: BaseTemplateEmailDto, route: string, request: Request) {
    const url = this.buildUrl(route);
    return await this.sendEmail(dto, url, request);
  }

  async sendAgentApplicationDeclined(dto: AgentDeclinedRegistrationDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/declined-registration', request)
  }

  async sendAgentApplicationApproved(dto: AgentApprovedRegistrationDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/approved-registration', request)
  }

  async sendAgentOnboardingCompleted(dto: AgentOnboardingCompletedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/onboarding-completed', request)
  }

  async sendAgentAccountApproved(dto: AgentAccountApprovedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/account-approved', request);
  }

  async sendAgentAccountRejected(dto: AgentAccountRejectedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/account-rejected', request);
  }

  async sendAgentAccountSuspension(dto: AgentAccountSuspensionDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/account-suspension', request);
  }

  async sendAgentBankDetailsUpdate(dto: AgentBankDetailsUpdateDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/bank-details-update', request);
  }

  async sendAgentBonusEarned(dto: AgentBonusEarnedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/bonus-earned', request);
  }

  async sendAgentCommissionEarned(dto: AgentCommissionEarnedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/commission-earned', request);
  }

  async sendAgentCustomerStartedApplication(dto: AgentCustomerStartedApplicationDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/customer-started-application', request);
  }

  async sendAgentPasswordChangeConfirmation(dto: AgentPasswordChangeConfirmationDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/password-change-confirmation', request);
  }

  async sendAgentPasswordResetRequest(dto: AgentPasswordResetRequestDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/password-reset-request', request);
  }

  async sendAgentPayoutApproved(dto: AgentPayoutApprovedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/payout-approved', request);
  }

  async sendAgentPayoutRejected(dto: AgentPayoutRejectedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/payout-rejected', request);
  }

  async sendAgentPayoutRequestReceived(dto: AgentPayoutRequestReceivedDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/payout-request-received', request);
  }

  async sendAgentProfileSubmission(dto: AgentProfileSubmissionDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/profile-submission', request);
  }

  async sendAgentVerify(dto: AgentVerifyDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/verify', request);
  }

  async sendAgentWelcome(dto: AgentWelcomeDto, request: Request) {
    return await this.sendAgentTemplateEmail(dto, '/agent/welcome', request);
  }

}