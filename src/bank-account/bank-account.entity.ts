import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { Agent } from '../agent/agent.entity';

@Entity({ name: 'bank_accounts' })
export class BankAccount extends AbstractBaseEntity {
    @OneToOne(() => Agent, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'agent_id' })
    agent: Agent;

    @Column({ unique: true })
    agentId: number;

    @Column({ nullable: false })
    bankName: string;

    @Column({ nullable: false })
    accountName: string;

    @Column({ nullable: false })
    accountNumber: string;
}
