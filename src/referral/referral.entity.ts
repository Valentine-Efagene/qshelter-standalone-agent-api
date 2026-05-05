import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../common/common.pure.entity';
import { User } from '../user/user.entity';
import { Agent } from '../agent/agent.entity';
import { Commission } from '../commission/commission.entity';

@Entity({ name: 'referrals' })
@Index(['referreeId', 'referrerId'], { unique: true }) // Composite unique index
export class Referral extends AbstractBaseEntity {
  @ManyToOne(() => User,
    user => user.referral,
    {
      eager: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  @JoinColumn({ name: 'referree_id' })
  referree: User;

  @Column()
  referreeId: number;

  @ManyToOne(() => Agent, (agent) => agent.referrals, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'referrer_id' })
  referrer: Agent;

  @Column()
  referrerId: number;

  @OneToMany(() => Commission, (commission) => commission.referral)
  commissions: Commission[];
}
