import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentConfiguration } from './agent-configuration.entity';
import { AgentConfigurationService } from './agent-configuration.service';
import { AgentConfigurationController } from './agent-configuration.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AgentConfiguration])],
    providers: [AgentConfigurationService],
    controllers: [AgentConfigurationController],
    exports: [AgentConfigurationService],
})
export class AgentConfigurationModule { }
