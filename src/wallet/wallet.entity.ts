import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';

/**
 * Read-only entity mapping to the external financial service `wallets` table.
 * This service does not own this data — do not write to this table.
 */
@Entity({ name: 'wallets' })
export class Wallet extends AbstractBaseEntity {
    @Column({ name: 'agent_id' })
    agentId: number;

    @Column({ name: 'account_balance', type: 'decimal', precision: 20, scale: 2, default: 0 })
    accountBalance: number;

    @Column({ name: 'account_name', nullable: true })
    accountName: string;

    @Column({ name: 'account_number', nullable: true })
    accountNumber: string;

    @Column({ nullable: true })
    bank: string;

    @Column({ name: 'total_commissions', type: 'decimal', precision: 20, scale: 2, default: 0 })
    totalCommissions: number;

    @Column({ name: 'total_bonuses', type: 'decimal', precision: 20, scale: 2, default: 0 })
    totalBonuses: number;
}
