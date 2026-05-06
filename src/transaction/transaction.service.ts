import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated, buildPaginatedResult } from '../common/common.dto';
import { TransactionPaginationDto } from './transaction.dto';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async findAllPaginated(query: TransactionPaginationDto): Promise<Paginated<Transaction>> {
        const { page = 1, limit = 20, type, status, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.transactionRepository.createQueryBuilder('transaction')
            .orderBy('transaction.createdAt', 'DESC');

        if (type) qb.andWhere('transaction.type = :type', { type });
        if (status) qb.andWhere('transaction.status = :status', { status });
        if (from) qb.andWhere('transaction.createdAt >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('transaction.createdAt <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }

    async findOne(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({ where: { id } });
        if (!transaction) {
            throw new NotFoundException(`Transaction #${id} not found`);
        }
        return transaction;
    }

    async findByAgent(agentId: number, query: TransactionPaginationDto): Promise<Paginated<Transaction>> {
        const { page = 1, limit = 20, type, status, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.transactionRepository.createQueryBuilder('transaction')
            .where('transaction.agentId = :agentId', { agentId })
            .orderBy('transaction.createdAt', 'DESC');

        if (type) qb.andWhere('transaction.type = :type', { type });
        if (status) qb.andWhere('transaction.status = :status', { status });
        if (from) qb.andWhere('transaction.createdAt >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('transaction.createdAt <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }

    async findByWallet(walletId: number, query: TransactionPaginationDto): Promise<Paginated<Transaction>> {
        const { page = 1, limit = 20, type, status, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.transactionRepository.createQueryBuilder('transaction')
            .where('transaction.walletId = :walletId', { walletId })
            .orderBy('transaction.createdAt', 'DESC');

        if (type) qb.andWhere('transaction.type = :type', { type });
        if (status) qb.andWhere('transaction.status = :status', { status });
        if (from) qb.andWhere('transaction.createdAt >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('transaction.createdAt <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }
}
