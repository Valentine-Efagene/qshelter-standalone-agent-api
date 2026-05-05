import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { TransactionStatus, TransactionType } from './transaction.enums';

/**
 * Read-only entity mapping to the external financial service `transactions` table.
 * Represents credit/debit movements on an agent wallet.
 * This service does not own this data — do not write to this table.
 */
@Entity({ name: 'transactions' })
export class Transaction extends AbstractBaseEntity {
    @Column({ name: 'wallet_id' })
    walletId: number;

    @Column({ name: 'agent_id' })
    agentId: number;

    @Column({ type: 'decimal', precision: 20, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    type: TransactionType;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus;

    @Column({ nullable: true })
    reference: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'payment_id', nullable: true })
    paymentId: number;
}
