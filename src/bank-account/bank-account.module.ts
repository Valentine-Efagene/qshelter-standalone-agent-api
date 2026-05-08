import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from '../agent/agent.entity';
import { CaslModule } from '../common/casl/casl.module';
import { BankAccountController } from './bank-account.controller';
import { BankAccount } from './bank-account.entity';
import { BankAccountService } from './bank-account.service';

@Module({
    imports: [TypeOrmModule.forFeature([BankAccount, Agent]), CaslModule],
    providers: [BankAccountService],
    controllers: [BankAccountController],
    exports: [BankAccountService],
})
export class BankAccountModule { }
