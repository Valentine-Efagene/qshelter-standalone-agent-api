import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseReviewHistoryEntity } from '../common/common.entity';
import { PayoutStatus } from './payout.enums';
import { Payout } from './payout.entity';

@Entity({ name: 'payout_status_review_history' })
export class PayoutStatusReviewHistory extends AbstractBaseReviewHistoryEntity {
    @ManyToOne(() => Payout, (payout) => payout.reviewHistory, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'payout_id' })
    payout: Payout;

    @Column()
    payoutId: number;

    @Column({
        type: 'enum',
        enum: PayoutStatus,
        nullable: true,
    })
    fromStatus: PayoutStatus | null;

    @Column({
        type: 'enum',
        enum: PayoutStatus,
    })
    toStatus: PayoutStatus;
}
