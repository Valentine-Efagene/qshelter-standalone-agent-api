import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepository: Repository<Wallet>,
    ) { }

    async findByAgent(agentId: number): Promise<Wallet> {
        const wallet = await this.walletRepository.findOne({ where: { agentId } });
        if (!wallet) {
            throw new NotFoundException(`Wallet for agent #${agentId} not found`);
        }
        return wallet;
    }

    async findOne(id: number): Promise<Wallet> {
        const wallet = await this.walletRepository.findOne({ where: { id } });
        if (!wallet) {
            throw new NotFoundException(`Wallet #${id} not found`);
        }
        return wallet;
    }
}
