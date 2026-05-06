import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignAgent } from './campaign-agent.entity';
import { CampaignAgentTypeRate } from './campaign-agent-type-rate.entity';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { Agent } from '../agent/agent.entity';
import { AgentTypeModule } from '../agent-type/agent-type.module';
import { CaslModule } from '../common/casl/casl.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Campaign, CampaignAgent, CampaignAgentTypeRate, Agent]),
        AgentTypeModule,
        CaslModule,
    ],
    providers: [CampaignService],
    controllers: [CampaignController],
    exports: [CampaignService],
})
export class CampaignModule { }
