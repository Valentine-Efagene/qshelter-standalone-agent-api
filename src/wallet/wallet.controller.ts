import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('agent/:agentId')
    findByAgent(@Param('agentId', ParseIntPipe) agentId: number): Promise<Wallet> {
        return this.walletService.findByAgent(agentId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Wallet> {
        return this.walletService.findOne(id);
    }
}
