import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/auth/auth.guard';
import OpenApiHelper from '../common/OpenApiHelper';
import { ApiResult, okResponse } from '../common/common.dto';
import { ResponseMessage } from '../common/common.enum';
import { BankAccount } from './bank-account.entity';
import { BankAccountService } from './bank-account.service';
import { UpsertBankAccountDto } from './bank-account.dto';

@AuthGuard()
@Controller('bank-accounts')
@ApiTags('Bank Account')
@ApiResponse(OpenApiHelper.responseDoc)
export class BankAccountController {
    constructor(private readonly bankAccountService: BankAccountService) { }

    @Post()
    async upsert(
        @Body() dto: UpsertBankAccountDto,
    ): Promise<ApiResult<BankAccount>> {
        const data = await this.bankAccountService.upsert(dto);
        return okResponse(data, ResponseMessage.UPDATED);
    }

    @Get('by-agent/:agentId')
    async findByAgentId(
        @Param('agentId', ParseIntPipe) agentId: number,
    ): Promise<ApiResult<BankAccount>> {
        const data = await this.bankAccountService.findByAgentId(agentId);
        return okResponse(data, ResponseMessage.FETCHED);
    }
}
