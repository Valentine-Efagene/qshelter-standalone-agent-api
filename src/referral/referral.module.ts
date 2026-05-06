import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './referral.entity';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { CaslModule } from '../common/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Referral]), CaslModule],
  providers: [ReferralService],
  controllers: [ReferralController],
  exports: [ReferralService]
})
export class ReferralModule { }
