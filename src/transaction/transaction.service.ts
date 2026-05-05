import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    findAllPaginated(query: PaginateQuery): Promise<Paginated<Transaction>> {
        return paginate(query, this.transactionRepository, {
            sortableColumns: ['id', 'createdAt', 'amount'],
            defaultSortBy: [['createdAt', 'DESC']],
            filterableColumns: {
                agentId: true,
                walletId: true,
                type: true,
                status: true,
            },
        });
    }

    async findOne(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException(`Transaction #${id} not found`);
        }
        return transaction;
    }

    findByAgent(agentId: number, query: PaginateQuery): Promise<Paginated<Transaction>> {
        return paginate(query, this.transactionRepository, {
            sortableColumns: ['id', 'createdAt', 'amount'],
            defaultSortBy: [['createdAt', 'DESC']],
            where: { agentId },
            filterableColumns: { type: true, status: true },
        });
    }

    findByWallet(walletId: number, query: PaginateQuery): Promise<Paginated<Transaction>> {
        return paginate(query, this.transactionRepository, {
            sortableColumns: ['id', 'createdAt', 'amount'],
            defaultSortBy: [['createdAt', 'DESC']],
            where: { walletId },
            filterableColumns: { type: true, status: true },
        });
    }
}
