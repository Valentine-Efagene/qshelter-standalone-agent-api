import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from '../referral/referral.entity';
import { Payment } from '../payment/payment.entity';
import { Commission } from '../commission/commission.entity';
import { Agent } from '../agent/agent.entity';
import { AgentConfigurationModule } from '../agent-configuration/agent-configuration.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Referral, Payment, Commission, Agent]),
        AgentConfigurationModule,
    ],
    providers: [AnalyticsService],
    controllers: [AnalyticsController],
})
export class AnalyticsModule { }
