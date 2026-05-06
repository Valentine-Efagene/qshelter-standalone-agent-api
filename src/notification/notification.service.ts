import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { AuthHelper } from '../common/auth/auth.helper';
import { AgentApprovedRegistrationDto, AgentDeclinedRegistrationDto, AgentOnboardingCompletedDto, INotificationResponse } from './notification.dto';
import EnvironmentHelper from '../common/helpers/EnvironmentHelper';
import { HttpService } from '@nestjs/axios';
import ErrorHelper from '../common/helpers/ErrorHelper';

@Injectable()
export class NotificationService {
  baseUrl: string
  arn: string

  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly httpService: HttpService
  ) {
    this.baseUrl = EnvironmentHelper.env.NOTIFICATION_URL
  }

  async sendEmail(emailDto: any, endpoint: string, request: Request): Promise<INotificationResponse> {
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

  async sendAgentApplicationDeclined(dto: AgentDeclinedRegistrationDto, request: Request) {
    const route = '/agent/declined-registration'
    const url = `${this.baseUrl}${route}`
    return await this.sendEmail(dto, url, request)
  }

  async sendAgentApplicationApproved(dto: AgentApprovedRegistrationDto, request: Request) {
    const route = '/agent/approved-registration'
    const url = `${this.baseUrl}${route}`
    return await this.sendEmail(dto, url, request)
  }

  async sendAgentOnboardingCompleted(dto: AgentOnboardingCompletedDto, request: Request) {
    const route = '/agent/onboarding-completed'
    const url = `${this.baseUrl}${route}`
    return await this.sendEmail(dto, url, request)
  }

}