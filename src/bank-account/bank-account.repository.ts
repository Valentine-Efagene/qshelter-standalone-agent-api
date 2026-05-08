import { Repository } from 'typeorm';
import { BankAccount } from './bank-account.entity';

export class BankAccountRepository extends Repository<BankAccount> {
    // ...
}
