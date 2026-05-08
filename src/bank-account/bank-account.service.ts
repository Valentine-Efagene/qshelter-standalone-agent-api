import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../agent/agent.entity';
import { BankAccount } from './bank-account.entity';
import { UpsertBankAccountDto } from './bank-account.dto';

@Injectable()
export class BankAccountService {
    constructor(
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
    ) { }

    async upsert(dto: UpsertBankAccountDto): Promise<BankAccount> {
        const agent = await this.agentRepository.findOneBy({ id: dto.agentId });
        if (!agent) {
            throw new NotFoundException(`Agent with ID ${dto.agentId} not found`);
        }

        const existing = await this.bankAccountRepository.findOneBy({ agentId: dto.agentId });
        if (!existing) {
            const entity = this.bankAccountRepository.create(dto);
            return this.bankAccountRepository.save(entity);
        }

        this.bankAccountRepository.merge(existing, dto);
        return this.bankAccountRepository.save(existing);
    }

    async findByAgentId(agentId: number): Promise<BankAccount> {
        const bankAccount = await this.bankAccountRepository.findOneBy({ agentId });
        if (!bankAccount) {
            throw new NotFoundException(`Bank account for agent ID ${agentId} not found`);
        }
        return bankAccount;
    }
}
