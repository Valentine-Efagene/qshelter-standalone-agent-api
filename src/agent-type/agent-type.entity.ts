import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { CampaignAgentTypeRate } from '../campaign/campaign-agent-type-rate.entity';

@Entity({ name: 'agent_types' })
export class AgentTypeLookup extends AbstractBaseEntity {
    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => CampaignAgentTypeRate, (rate) => rate.agentType)
    campaignRates: CampaignAgentTypeRate[];
}
