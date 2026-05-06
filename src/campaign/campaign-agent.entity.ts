import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { Campaign } from './campaign.entity';
import { Agent } from '../agent/agent.entity';

@Entity({ name: 'campaign_agents' })
@Index(['campaignId', 'agentId'], { unique: true })
export class CampaignAgent extends AbstractBaseEntity {
    @ManyToOne(() => Campaign, (campaign) => campaign.agentAssignments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'campaign_id' })
    campaign: Campaign;

    @Column()
    campaignId: number;

    @ManyToOne(() => Agent, (agent) => agent.campaignAssignments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'agent_id' })
    agent: Agent;

    @Column()
    agentId: number;
}
