import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AgentType } from './agent.enums';
import { LicensingInfo } from '../licensing-info/licensing-info.entity';
import { Referral } from '../referral/referral.entity';
import { CreateAgentDto } from './agent.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractBaseReviewableEntity } from '../common/common.entity';
import { Status } from '../common/common.type';
import { AgentPoc } from '../agent-poc/agent-poc.entity';
import { User } from '../user/user.entity';

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
  phone2: string;

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
  accountName: string;

  @Column({
    nullable: true
  })
  accountNumber: string;

  @Column({
    nullable: true
  })
  countryOfResidence: string;

  @Column({
    nullable: true
  })
  state: string;

  @Column({
    nullable: true
  })
  city: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ nullable: true })
  comment: string;
}
