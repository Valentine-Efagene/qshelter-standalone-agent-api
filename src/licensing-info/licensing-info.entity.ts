import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { AgentDocument } from '../agent-document/agent-document.entity';
import { Agent } from '../agent/agent.entity';

@Entity({ name: 'licensing_info' })
export class LicensingInfo extends AbstractBaseEntity {
  @ManyToOne(() => Agent, (agent) => agent.licensingInfo, {
    //eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @Column({ nullable: true })
  agentId: number;

  @OneToMany(
    () => AgentDocument,
    (agentDocument) => agentDocument.licensingInfo,
    { eager: true },
  )
  agentDocuments: AgentDocument[];

  @Column({
    nullable: true,
  })
  regulatoryBody: string;
}
