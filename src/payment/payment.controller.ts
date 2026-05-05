import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get()
    findAll(@Paginate() query: PaginateQuery) {
        return this.paymentService.findAllPaginated(query);
    }

    @Get('agent/:agentId')
    findByAgent(
        @Param('agentId', ParseIntPipe) agentId: number,
        @Paginate() query: PaginateQuery,
    ) {
        return this.paymentService.findByAgent(agentId, query);
    }

    @Get('customer/:customerId')
    findByCustomer(
        @Param('customerId', ParseIntPipe) customerId: number,
        @Paginate() query: PaginateQuery,
    ) {
        return this.paymentService.findByCustomer(customerId, query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
        return this.paymentService.findOne(id);
    }
}
