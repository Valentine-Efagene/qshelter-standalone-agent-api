import { Repository } from 'typeorm';
import { Payout } from './payout.entity';

export class PayoutRepository extends Repository<Payout> {
    // ...
}
