import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { PaymentPaginationDto } from './payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get()
    findAll(@Query() query: PaymentPaginationDto) {
        return this.paymentService.findAllPaginated(query);
    }

    @Get('agent/:agentId')
    findByAgent(
        @Param('agentId', ParseIntPipe) agentId: number,
        @Query() query: PaymentPaginationDto,
    ) {
        return this.paymentService.findByAgent(agentId, query);
    }

    @Get('customer/:customerId')
    findByCustomer(
        @Param('customerId', ParseIntPipe) customerId: number,
        @Query() query: PaymentPaginationDto,
    ) {
        return this.paymentService.findByCustomer(customerId, query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
        return this.paymentService.findOne(id);
    }
}
