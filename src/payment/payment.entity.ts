import { Column, Entity } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { PaymentStatus, PaymentType } from './payment.enums';

/**
 * Read-only entity mapping to the external financial service `payments` table.
 * This service does not own this data — do not write to this table.
 */
@Entity({ name: 'payments' })
export class Payment extends AbstractBaseEntity {
    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({ name: 'agent_id', nullable: true })
    agentId: number;

    @Column({ type: 'decimal', precision: 20, scale: 2 })
    amount: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({
        type: 'enum',
        enum: PaymentType,
        nullable: true,
    })
    type: PaymentType;

    @Column({ nullable: true })
    reference: string;

    @Column({ name: 'payment_date', nullable: true })
    paymentDate: Date;

    @Column({ name: 'property_id', nullable: true })
    propertyId: number;

    /**
     * Full value of the property being purchased.
     * Used for Total Asset Value and bonus tier calculations.
     * Differs from `amount` which is the installment/payment received.
     */
    @Column({ name: 'property_value', type: 'decimal', precision: 20, scale: 2, nullable: true })
    propertyValue: number;
}
