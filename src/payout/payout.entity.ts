import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractBaseReviewableEntity } from '../common/common.entity';
import { Agent } from '../agent/agent.entity';
import { PayoutStatus } from './payout.enums';
import { PayoutStatusReviewHistory } from './payout-status-review-history.entity';

@Entity({ name: 'payouts' })
export class Payout extends AbstractBaseReviewableEntity {
    @ManyToOne(() => Agent, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'agent_id' })
    agent: Agent;

    @Column({ nullable: false })
    agentId: number;

    @Column({
        type: 'double precision',
        scale: 2,
        precision: 20,
        nullable: false,
        comment: 'Requested payout amount',
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: PayoutStatus,
        default: PayoutStatus.PENDING,
    })
    status: PayoutStatus;

    @Column({ nullable: true, type: 'text' })
    rejectionReason?: string;

    @OneToMany(() => PayoutStatusReviewHistory, (history) => history.payout)
    reviewHistory: PayoutStatusReviewHistory[];
}
