import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Get()
    findAll(@Paginate() query: PaginateQuery) {
        return this.transactionService.findAllPaginated(query);
    }

    @Get('agent/:agentId')
    findByAgent(
        @Param('agentId', ParseIntPipe) agentId: number,
        @Paginate() query: PaginateQuery,
    ) {
        return this.transactionService.findByAgent(agentId, query);
    }

    @Get('wallet/:walletId')
    findByWallet(
        @Param('walletId', ParseIntPipe) walletId: number,
        @Paginate() query: PaginateQuery,
    ) {
        return this.transactionService.findByWallet(walletId, query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
        return this.transactionService.findOne(id);
    }
}
