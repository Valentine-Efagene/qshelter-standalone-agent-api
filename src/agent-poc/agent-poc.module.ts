import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentPoc } from './agent-poc.entity';
import { AgentPocController } from './agent-poc.controller';
import { AgentPocService } from './agent-poc.service';
import { CaslModule } from '../common/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([AgentPoc]), CaslModule],
  providers: [AgentPocService],
  controllers: [AgentPocController],
  exports: [AgentPocService],
})
export class AgentPocModule { }
