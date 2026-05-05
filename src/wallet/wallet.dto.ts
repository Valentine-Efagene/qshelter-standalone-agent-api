import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WalletDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    agentId: number;

    @ApiProperty()
    accountBalance: number;

    @ApiPropertyOptional()
    accountName: string;

    @ApiPropertyOptional()
    accountNumber: string;

    @ApiPropertyOptional()
    bank: string;

    @ApiProperty()
    totalCommissions: number;

    @ApiProperty()
    totalBonuses: number;
}
