import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { CampaignAgent } from './campaign-agent.entity';
import { CampaignAgentTypeRate } from './campaign-agent-type-rate.entity';
import { Commission } from '../commission/commission.entity';

@Entity({ name: 'campaigns' })
export class Campaign extends AbstractBaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true, type: 'text' })
    description?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    priority: number;

    @Column({ type: 'timestamp', nullable: true })
    startsAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    endsAt?: Date;

    @OneToMany(() => CampaignAgent, (assignment) => assignment.campaign)
    agentAssignments: CampaignAgent[];

    @OneToMany(() => CampaignAgentTypeRate, (rate) => rate.campaign)
    rates: CampaignAgentTypeRate[];

    @OneToMany(() => Commission, (commission) => commission.campaign)
    commissions: Commission[];
}
