import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { AgentType } from '../agent/agent.enums';

/**
 * Stores configurable financial rules per agent type.
 * One row per AgentType. Managed by ADMIN/SUPER_ADMIN only.
 *
 * Bonus tiers are based on total property value sold (not cash received).
 * Tier 2 threshold must be greater than Tier 1 threshold.
 */
@Entity({ name: 'agent_configurations' })
export class AgentConfiguration extends AbstractBaseEntity {
    @Column({
        type: 'enum',
        enum: AgentType,
        unique: true,
    })
    agentType: AgentType;

    /**
     * Commission rate applied to each payment amount.
     * e.g. 0.05 = 5%
     */
    @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 4 })
    commissionRate: number;

    /**
     * Minimum total property value sold to qualify for Tier 1 bonus.
     */
    @Column({ name: 'bonus_tier1_threshold', type: 'decimal', precision: 20, scale: 2 })
    bonusTier1Threshold: number;

    /**
     * Bonus percentage paid at Tier 1.
     * e.g. 0.02 = 2%
     */
    @Column({ name: 'bonus_tier1_rate', type: 'decimal', precision: 5, scale: 4 })
    bonusTier1Rate: number;

    /**
     * Minimum total property value sold to qualify for Tier 2 bonus.
     * Must be > bonusTier1Threshold.
     */
    @Column({ name: 'bonus_tier2_threshold', type: 'decimal', precision: 20, scale: 2 })
    bonusTier2Threshold: number;

    /**
     * Bonus percentage paid at Tier 2.
     * e.g. 0.05 = 5%
     */
    @Column({ name: 'bonus_tier2_rate', type: 'decimal', precision: 5, scale: 4 })
    bonusTier2Rate: number;
}
