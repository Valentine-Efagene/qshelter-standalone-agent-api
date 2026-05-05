import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from './transaction.enums';

export class TransactionDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    walletId: number;

    @ApiProperty()
    agentId: number;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: TransactionType })
    type: TransactionType;

    @ApiProperty({ enum: TransactionStatus })
    status: TransactionStatus;

    @ApiPropertyOptional()
    reference: string;

    @ApiPropertyOptional()
    description: string;

    @ApiPropertyOptional()
    paymentId: number;

    @ApiProperty()
    createdAt: Date;
}
