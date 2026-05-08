import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseReviewHistoryEntity } from '../common/common.entity';
import { Agent } from './agent.entity';
import { AgentStatus } from './agent.enums';

@Entity({ name: 'agent_status_review_history' })
export class AgentStatusReviewHistory extends AbstractBaseReviewHistoryEntity {
    @ManyToOne(() => Agent, (agent) => agent.reviewHistory, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'agent_id' })
    agent: Agent;

    @Column()
    agentId: number;

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
}
