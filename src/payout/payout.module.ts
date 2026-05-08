import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../agent/agent.entity';
import { CaslModule } from '../common/casl/casl.module';
import { NotificationModule } from '../notification/notification.module';
import { PayoutController } from './payout.controller';
import { Payout } from './payout.entity';
import { PayoutStatusReviewHistory } from './payout-status-review-history.entity';
import { PayoutService } from './payout.service';

@Module({
    imports: [TypeOrmModule.forFeature([Payout, PayoutStatusReviewHistory, Agent]), NotificationModule, CaslModule],
    providers: [PayoutService],
    controllers: [PayoutController],
    exports: [PayoutService],
})
export class PayoutModule { }
