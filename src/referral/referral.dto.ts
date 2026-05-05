import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Referral } from './referral.entity';
import { PaginationMeta } from '../common/common.dto';

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
