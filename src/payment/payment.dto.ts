import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus, PaymentType } from './payment.enums';

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
