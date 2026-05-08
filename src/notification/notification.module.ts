import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { HttpModule } from '@nestjs/axios';
import { CaslModule } from '../common/casl/casl.module';

@Module({
  imports: [HttpModule, CaslModule],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService]
})

export class NotificationModule { }
