import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './referral.entity';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { CaslModule } from '../common/casl/casl.module';
import { NotificationModule } from '../notification/notification.module';
import { Agent } from '../agent/agent.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Referral, Agent, User]), NotificationModule, CaslModule],
  providers: [ReferralService],
  controllers: [ReferralController],
  exports: [ReferralService]
})
export class ReferralModule { }
