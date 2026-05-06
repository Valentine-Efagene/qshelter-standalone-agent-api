import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { Commission } from './commission.entity';
import { PaginationDto, PaginationMeta } from '../common/common.dto';
import { Transform, Type } from 'class-transformer';
import { User } from '../user/user.entity';
import { CommissionStatus } from './commission.enums';

export class CreateCommissionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  referralId: number;

  @ApiProperty({
    example: 100000000.5,
  })
  @IsNumber()
  @Type(() => Number)
  amount: number;
}

export class PostCommissionWithCodeDto {
  @ApiProperty({ example: 'eowieow' })
  @IsNotEmpty()
  referralCode: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 100000000.5,
  })
  @IsNumber()
  @Type(() => Number)
  amount: number;
}

export class UpdateCommissionDto {
  @Type(() => Number)
  @ApiPropertyOptional({
    nullable: true,
    example: 1000000
  })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  @IsNumber()
  amount?: number;

  @Type(() => String)
  @ApiPropertyOptional({
  })
  @IsOptional()
  @IsString()
  comment?: string

  @ApiPropertyOptional({
    type: 'enum',
    enum: CommissionStatus,
    example: CommissionStatus.PAID
  })
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus
}

export class PaginatedCommissions {
  data: Commission[];

  meta: PaginationMeta;
}

export class CommissionPaginationDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter commissions created on or after this date (ISO 8601)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter commissions created on or before this date (ISO 8601)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ enum: CommissionStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;

  @ApiPropertyOptional({ description: 'Filter by agent ID', example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  agentId?: number;
}

export class AgentCommissionPaginationDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter commissions created on or after this date (ISO 8601)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter commissions created on or before this date (ISO 8601)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ enum: CommissionStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(CommissionStatus)
  status?: CommissionStatus;
}

export class Customer extends PickType(User, ['id', 'avatar', 'firstName', 'lastName', 'email', 'phone']) {

}

export class SinglePaginatedAgentCommission extends Commission {
  customer: Customer
}

export class PaginatedAgentCommissions {
  data: SinglePaginatedAgentCommission[];

  meta: PaginationMeta;
}