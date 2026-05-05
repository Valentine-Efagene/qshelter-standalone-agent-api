import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from './user.enums';
import { User } from './user.entity';
import { PickType } from '@nestjs/swagger';
import { PaginationMeta } from '../common/common.dto';

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
  data: User[];

  meta: PaginationMeta;
}

export class UserWithCommissionDto extends PickType(User, ['id', 'firstName', 'lastName', 'avatar', 'email', 'createdAt'] as const) {
  totalCommission: number
}
