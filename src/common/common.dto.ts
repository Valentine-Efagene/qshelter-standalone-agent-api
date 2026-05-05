import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsNumberString,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { DocumentStatus, MediaType } from './common.type';
import { Transform } from 'class-transformer';

export class Document {
  url: string;
  name: string;
  description: string;
}

export class ApproveDocumentDto {
  @ApiProperty({ nullable: false, example: 1 })
  @IsNotEmpty()
  reviewerId: number;
}

export class UpdateDocumentStatusDto {
  @ApiProperty({
    nullable: false,
    enum: DocumentStatus,
    example: DocumentStatus.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @ApiPropertyOptional({
    description: 'Required for declines',
  })
  declineReason: string;

  @ApiProperty({ nullable: false, example: 1 })
  @IsNotEmpty()
  reviewerId: number;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({ nullable: true })
  name?: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string;

  @ApiPropertyOptional({ nullable: true })
  url?: string;

  @ApiPropertyOptional({
    nullable: true,
    type: 'enum',
    enum: MediaType,
  })
  mediaType?: MediaType;
}

export class DeclineDocumentDto {
  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  @IsString()
  declineReason?: string;

  @ApiProperty({ nullable: false, example: 1 })
  @IsNotEmpty()
  @IsString()
  reviewerId: number;
}

@ApiExtraModels(StandardApiResponse)
export class StandardApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class DocumentReuploadDto {
  @ApiProperty({
    nullable: false,
    description: 'ID of the file to replace',
  })
  @IsNotEmpty()
  @IsNumberString()
  id: number;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Optional new name for the file',
  })
  name?: string;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Optional new description for the file',
  })
  description?: string;
}

export class PaginationArgs {
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number;

  // @Field(() => Int)
  // sortBy?: [string, string][];

  @IsOptional()
  searchBy?: string[];

  @IsOptional()
  search?: string;

  @IsOptional()
  select?: string[];
}

export class FilterInput {
  column: string;

  values?: string[];
}

export class PaginationMeta {
  itemsPerPage: number;

  totalItems: number;

  currentPage: number;

  totalPages: number;

  sortBy?: string[];

  searchBy?: string[];

  search?: string;

  select?: string[];

  filter?: FilterInput[];
}

export declare class Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy?: string[];
    searchBy?: string[];
    search?: string;
    select?: string[];
    filter?: {
      [column: string]: string | string[];
    };
  };
  // links: {
  //   first?: string;
  //   previous?: string;
  //   current: string;
  //   next?: string;
  //   last?: string;
  // };
}

export class PaginationDto {
  @ApiPropertyOptional({
    default: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  page: number;

  @ApiPropertyOptional({
    default: 20
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  limit: number;
}
