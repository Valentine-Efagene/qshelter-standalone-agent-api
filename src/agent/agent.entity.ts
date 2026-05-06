import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AgentIdType, AgentStatus, AgentType } from './agent.enums';
import { LicensingInfo } from '../licensing-info/licensing-info.entity';
import { Referral } from '../referral/referral.entity';
import { CreateAgentDto } from './agent.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractBaseReviewableEntity } from '../common/common.entity';
import { AgentPoc } from '../agent-poc/agent-poc.entity';
import { User } from '../user/user.entity';
import { AgentStatusReviewHistory } from './agent-status-review-history.entity';
import { CampaignAgent } from '../campaign/campaign-agent.entity';

@Entity({ name: 'agents' })
export class Agent extends AbstractBaseReviewableEntity {
  constructor(agentData?: CreateAgentDto) {
    super();
    if (agentData) {
      Object.assign(this, agentData);
    }
  }

  @OneToOne(() => User, {
    // eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @OneToOne(() => AgentPoc, (poc) => poc.agent)
  poc: AgentPoc;

  @Column({ nullable: true })
  referralCode: string;

  @Column({
    nullable: true
  })
  @IsNumber()
  @Type(() => Number)
  commissionPercentage: number;

  @Column({
    type: 'enum',
    enum: AgentType,
    default: AgentType.QSHELTER_LICENSED,
  })
  agentType: AgentType;

  @OneToMany(() => LicensingInfo, (licensingInfo) => licensingInfo.agent)
  licensingInfo: LicensingInfo[];

  @OneToMany(() => Referral, (referral) => referral.referrer)
  referrals: Referral[];

  @OneToMany(() => AgentStatusReviewHistory, (history) => history.agent)
  reviewHistory: AgentStatusReviewHistory[];

  @OneToMany(() => CampaignAgent, (assignment) => assignment.agent)
  campaignAssignments: CampaignAgent[];

  @Column()
  title: string;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: true
  })
  phone: string;

  @Column({
    nullable: true
  })
  companyName: string;

  @Column({
    nullable: true
  })
  rcNumber: string;

  @Column({
    nullable: true
  })
  companyEmail: string;

  @Column({
    nullable: true
  })
  companyPhone: string;

  @Column({
    nullable: true
  })
  bankName: string;

  @Column({
    nullable: true
  })
  accountNumber: string;

  @Column({
    type: 'enum',
    enum: AgentIdType,
    nullable: true,
  })
  idType?: AgentIdType;

  @Column({ nullable: true })
  idDocument?: string;

  @Column({ nullable: true })
  idNumber?: string;

  @Column({
    type: 'enum',
    enum: AgentStatus,
    default: AgentStatus.BASIC_INFO,
  })
  status: AgentStatus;

  @Column({ default: false })
  termsAccepted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt: Date;
}
