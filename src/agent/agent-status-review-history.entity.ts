import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { Agent } from './agent.entity';
import { AgentStatus } from './agent.enums';
import { User } from '../user/user.entity';

@Entity({ name: 'agent_status_review_history' })
export class AgentStatusReviewHistory extends AbstractBaseEntity {
    @ManyToOne(() => Agent, (agent) => agent.reviewHistory, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'agent_id' })
    agent: Agent;

    @Column()
    agentId: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'reviewer_id' })
    reviewer: User;

    @Column()
    reviewerId: number;

    @Column({
        type: 'enum',
        enum: AgentStatus,
        nullable: true,
    })
    fromStatus: AgentStatus | null;

    @Column({
        type: 'enum',
        enum: AgentStatus,
    })
    toStatus: AgentStatus;

    @Column({ nullable: true, type: 'text' })
    comment: string | null;

    @Column({ type: 'timestamp' })
    reviewedAt: string;
}
