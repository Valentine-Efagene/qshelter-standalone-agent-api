import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto, PaginationMeta } from '../common/common.dto';
import { Payout } from './payout.entity';
import { PayoutStatus } from './payout.enums';

export class CreatePayoutDto {
    @ApiProperty({ description: 'Agent ID', example: 1 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    agentId: number;

    @ApiProperty({ description: 'Payout amount', example: 150000 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    amount: number;
}

export class UpdatePayoutStatusDto {
    @ApiProperty({ enum: PayoutStatus, example: PayoutStatus.APPROVED })
    @IsEnum(PayoutStatus)
    status: PayoutStatus;

    @ApiProperty({ description: 'Reviewer user ID', example: 2 })
    @Type(() => Number)
    @IsInt()
    reviewerId: number;

    @ApiPropertyOptional({ description: 'Required when status is REJECTED' })
    @IsOptional()
    @IsString()
    rejectionReason?: string;
}

export class PayoutPaginationDto extends PaginationDto {
    @ApiPropertyOptional({ enum: PayoutStatus, description: 'Filter by status' })
    @IsOptional()
    @IsEnum(PayoutStatus)
    status?: PayoutStatus;

    @ApiPropertyOptional({ description: 'Filter by agent ID', example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    agentId?: number;

    @ApiPropertyOptional({ description: 'Filter payouts created on or after this date (ISO 8601)', example: '2025-01-01' })
    @IsOptional()
    from?: string;

    @ApiPropertyOptional({ description: 'Filter payouts created on or before this date (ISO 8601)', example: '2025-12-31' })
    @IsOptional()
    to?: string;
}

export class PaginatedPayouts {
    items: Payout[];
    meta: PaginationMeta;
}
