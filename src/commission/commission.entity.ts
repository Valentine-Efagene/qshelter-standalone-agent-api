import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { Referral } from '../referral/referral.entity';
import { CommissionStatus } from './commission.enums';
import { Campaign } from '../campaign/campaign.entity';

@Entity({ name: 'commissions' })
export class Commission extends AbstractBaseEntity {
  @ManyToOne(() => Referral, (referral) => referral.commissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'referral_id' })
  referral: Referral;

  @Column({ nullable: true })
  referralId: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.commissions, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign?: Campaign;

  @Column({ nullable: true })
  campaignId?: number;

  @Column({
    type: 'double precision',
    scale: 2,
    precision: 20,
    nullable: true,
    comment: 'Commission received',
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: CommissionStatus,
    default: CommissionStatus.PENDING,
  })
  status: CommissionStatus;

  @Column({
    nullable: true
  })
  comment: string
}
