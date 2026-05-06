import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PropertyController } from './notification.controller';
import { HttpModule } from '@nestjs/axios';
import { CaslModule } from '../common/casl/casl.module';

@Module({
  imports: [HttpModule, CaslModule],
  providers: [NotificationService],
  controllers: [PropertyController],
  exports: [NotificationService]
})

export class NotificationModule { }
