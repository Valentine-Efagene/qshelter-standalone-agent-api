import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, PaymentType } from './payment.enums';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../common/common.dto';

export class PaymentPaginationDto extends PaginationDto {
    @ApiPropertyOptional({ enum: PaymentStatus, description: 'Filter by payment status' })
    @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;

    @ApiPropertyOptional({ enum: PaymentType, description: 'Filter by payment type' })
    @IsOptional()
    @IsEnum(PaymentType)
    type?: PaymentType;

    @ApiPropertyOptional({ description: 'Filter by payment date on or after this date (ISO 8601)', example: '2025-01-01' })
    @IsOptional()
    from?: string;

    @ApiPropertyOptional({ description: 'Filter by payment date on or before this date (ISO 8601)', example: '2025-12-31' })
    @IsOptional()
    to?: string;
}

export class PaymentDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    customerId: number;

    @ApiPropertyOptional()
    agentId: number;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: PaymentStatus })
    status: PaymentStatus;

    @ApiPropertyOptional({ enum: PaymentType })
    type: PaymentType;

    @ApiPropertyOptional()
    reference: string;

    @ApiPropertyOptional()
    paymentDate: Date;

    @ApiPropertyOptional()
    propertyId: number;

    @ApiProperty()
    createdAt: Date;
}
