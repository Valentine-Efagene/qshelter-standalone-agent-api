import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { Payment } from './payment.entity';
import { PaymentStatus } from './payment.enums';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) { }

    findAllPaginated(query: PaginateQuery): Promise<Paginated<Payment>> {
        return paginate(query, this.paymentRepository, {
            sortableColumns: ['id', 'createdAt', 'amount', 'paymentDate'],
            defaultSortBy: [['paymentDate', 'DESC']],
            filterableColumns: {
                agentId: true,
                customerId: true,
                status: true,
                type: true,
            },
        });
    }

    async findOne(id: number): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({ where: { id } });
        if (!payment) {
            throw new NotFoundException(`Payment #${id} not found`);
        }
        return payment;
    }

    findByAgent(agentId: number, query: PaginateQuery): Promise<Paginated<Payment>> {
        return paginate(query, this.paymentRepository, {
            sortableColumns: ['id', 'createdAt', 'amount', 'paymentDate'],
            defaultSortBy: [['paymentDate', 'DESC']],
            where: { agentId },
            filterableColumns: { status: true, type: true },
        });
    }

    findByCustomer(customerId: number, query: PaginateQuery): Promise<Paginated<Payment>> {
        return paginate(query, this.paymentRepository, {
            sortableColumns: ['id', 'createdAt', 'amount', 'paymentDate'],
            defaultSortBy: [['paymentDate', 'DESC']],
            where: { customerId },
        });
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
