import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user.enums';
import { User } from './user.entity';
import { PickType } from '@nestjs/swagger';
import { PaginationMeta } from '../common/common.dto';
import { IsOptional } from 'class-validator';
import { PaginationDto } from '../common/common.dto';

export class CreateUserDto {
  @ApiProperty({ nullable: true, example: 'Jane' })
  firstName: string;

  @ApiProperty({ nullable: true, example: 'Doe' })
  lastName: string;

  @ApiProperty({ nullable: true, example: 'janedoe@testmail.com' })
  email: string;

  @ApiProperty({ nullable: true, example: ['agent'] })
  roles: UserRole[];
}

export class UpdateUserDto {
  @ApiPropertyOptional({ nullable: true })
  id?: number;
}

export class PaginatedUsers {
  items: User[];

  meta: PaginationMeta;
}

export class UserPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter users created on or after this date (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ description: 'Filter users created on or before this date (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  to?: string;
}

export class UserWithCommissionDto extends PickType(User, ['id', 'firstName', 'lastName', 'avatar', 'email', 'createdAt'] as const) {
  totalCommission: number
}
