import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated, buildPaginatedResult } from '../common/common.dto';
import { PaymentPaginationDto } from './payment.dto';
import { Payment } from './payment.entity';
import { PaymentStatus } from './payment.enums';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) { }

    async findAllPaginated(query: PaymentPaginationDto): Promise<Paginated<Payment>> {
        const { page = 1, limit = 20, status, type, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.paymentRepository.createQueryBuilder('payment')
            .orderBy('payment.paymentDate', 'DESC');

        if (status) qb.andWhere('payment.status = :status', { status });
        if (type) qb.andWhere('payment.type = :type', { type });
        if (from) qb.andWhere('payment.paymentDate >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('payment.paymentDate <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }

    async findOne(id: number): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({ where: { id } });
        if (!payment) {
            throw new NotFoundException(`Payment #${id} not found`);
        }
        return payment;
    }

    async findByAgent(agentId: number, query: PaymentPaginationDto): Promise<Paginated<Payment>> {
        const { page = 1, limit = 20, status, type, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.paymentRepository.createQueryBuilder('payment')
            .where('payment.agentId = :agentId', { agentId })
            .orderBy('payment.paymentDate', 'DESC');

        if (status) qb.andWhere('payment.status = :status', { status });
        if (type) qb.andWhere('payment.type = :type', { type });
        if (from) qb.andWhere('payment.paymentDate >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('payment.paymentDate <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }

    async findByCustomer(customerId: number, query: PaymentPaginationDto): Promise<Paginated<Payment>> {
        const { page = 1, limit = 20, status, type, from, to } = query;
        const skip = (page - 1) * limit;

        const qb = this.paymentRepository.createQueryBuilder('payment')
            .where('payment.customerId = :customerId', { customerId })
            .orderBy('payment.paymentDate', 'DESC');

        if (status) qb.andWhere('payment.status = :status', { status });
        if (type) qb.andWhere('payment.type = :type', { type });
        if (from) qb.andWhere('payment.paymentDate >= :from', { from: new Date(from) });
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            qb.andWhere('payment.paymentDate <= :to', { to: toDate });
        }

        const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return buildPaginatedResult(data, total, query);
    }

    async sumByAgent(agentId: number): Promise<number> {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('COALESCE(SUM(payment.amount), 0)', 'total')
            .where('payment.agentId = :agentId', { agentId })
            .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESSFUL })
            .getRawOne<{ total: number }>();
        return Number(result?.total ?? 0);
    }
}
