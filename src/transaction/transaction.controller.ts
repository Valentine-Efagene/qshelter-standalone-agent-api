import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { TransactionPaginationDto } from './transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Get()
    findAll(@Query() query: TransactionPaginationDto) {
        return this.transactionService.findAllPaginated(query);
    }

    @Get('agent/:agentId')
    findByAgent(
        @Param('agentId', ParseIntPipe) agentId: number,
        @Query() query: TransactionPaginationDto,
    ) {
        return this.transactionService.findByAgent(agentId, query);
    }

    @Get('wallet/:walletId')
    findByWallet(
        @Param('walletId', ParseIntPipe) walletId: number,
        @Query() query: TransactionPaginationDto,
    ) {
        return this.transactionService.findByWallet(walletId, query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
        return this.transactionService.findOne(id);
    }
}
