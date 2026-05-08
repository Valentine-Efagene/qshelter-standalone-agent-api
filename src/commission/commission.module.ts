import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './commission.entity';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { Referral } from '../referral/referral.entity';
import { AgentConfigurationModule } from '../agent-configuration/agent-configuration.module';
import { CaslModule } from '../common/casl/casl.module';
import { CampaignModule } from '../campaign/campaign.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Commission, Referral]), AgentConfigurationModule, CampaignModule, NotificationModule, CaslModule],
  providers: [CommissionService],
  controllers: [CommissionController],
  exports: [CommissionService]
})
export class CommissionModule { }
