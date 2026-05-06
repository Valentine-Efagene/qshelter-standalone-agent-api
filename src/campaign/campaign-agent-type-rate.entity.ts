import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { Campaign } from './campaign.entity';
import { AgentTypeLookup } from '../agent-type/agent-type.entity';

@Entity({ name: 'campaign_agent_type_rates' })
@Index(['campaignId', 'agentTypeCode'], { unique: true })
export class CampaignAgentTypeRate extends AbstractBaseEntity {
    @ManyToOne(() => Campaign, (campaign) => campaign.rates, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'campaign_id' })
    campaign: Campaign;

    @Column()
    campaignId: number;

    @ManyToOne(() => AgentTypeLookup, (agentType) => agentType.campaignRates, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        eager: true,
    })
    @JoinColumn({ name: 'agent_type_code', referencedColumnName: 'code' })
    agentType: AgentTypeLookup;

    @Column({ name: 'agent_type_code' })
    agentTypeCode: string;

    @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 4 })
    commissionRate: number;
}
