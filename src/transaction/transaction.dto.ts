import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from './transaction.enums';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../common/common.dto';

export class TransactionPaginationDto extends PaginationDto {
    @ApiPropertyOptional({ enum: TransactionType, description: 'Filter by transaction type' })
    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @ApiPropertyOptional({ enum: TransactionStatus, description: 'Filter by transaction status' })
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus;

    @ApiPropertyOptional({ description: 'Filter transactions created on or after this date (ISO 8601)', example: '2025-01-01' })
    @IsOptional()
    from?: string;

    @ApiPropertyOptional({ description: 'Filter transactions created on or before this date (ISO 8601)', example: '2025-12-31' })
    @IsOptional()
    to?: string;
}

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
