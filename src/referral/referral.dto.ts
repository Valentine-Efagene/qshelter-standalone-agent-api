import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Referral } from './referral.entity';
import { PaginationMeta } from '../common/common.dto';
import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../common/common.dto';

export class CreateReferralDto {
  @ApiProperty({
    nullable: true,
    description: 'Agent ID',
    example: 1
  })
  referrerId: number;

  @ApiProperty({
    nullable: true,
    example: 1,
    description: 'User ID'
  })
  referreeId: number;
}

export class UpdateReferralDto {
  @ApiPropertyOptional({
    nullable: true,
    description: 'Agent ID'
  })
  id: number;
}

export class PaginatedReferrals {
  data: Referral[];

  meta: PaginationMeta;
}

export class ReferralPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by referrer (agent) ID', example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  referrerId?: number;

  @ApiPropertyOptional({ description: 'Filter referrals created on or after this date (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ description: 'Filter referrals created on or before this date (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  to?: string;
}
