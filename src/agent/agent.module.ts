import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './agent.entity';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { CommissionModule } from '../commission/commission.module';
import { UserModule } from '../user/user.module';
import { AgentDocumentModule } from '../agent-document/agent-document.module';
import { NotificationModule } from '../notification/notification.module';
import { CaslModule } from '../common/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agent]), CommissionModule, UserModule, AgentDocumentModule, NotificationModule, CaslModule],
  providers: [AgentService],
  controllers: [AgentController],
})
export class AgentModule { }
