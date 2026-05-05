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

// ---------------------------------------------------------------------------
// Standard API response — discriminated union on `ok`
// ---------------------------------------------------------------------------

/** Returned by every successful endpoint. */
export interface SuccessResponse<T> {
  ok: true;
  body: T;
  message: string;
}

/** Returned by every failed endpoint (HTTP errors, validation, DB errors). */
export interface ErrorResponse {
  ok: false;
  body: null;
  message: string;
  /** Optional list of field-level validation messages. */
  errors?: string[];
}

/** Union type used as controller return type: `ApiResult<MyDto>` */
export type ApiResult<T> = SuccessResponse<T> | ErrorResponse;

// Keep the name `StandardApiResponse` as a class for Swagger compatibility.
export class StandardApiResponse<T = any> implements SuccessResponse<T> {
  ok: true = true;
  body: T;
  message: string;

  constructor(message: string, body: T) {
    this.message = message;
    this.body = body;
  }
}

/** Factory helper — use in controllers for success paths. */
export function okResponse<T>(body: T, message: string): SuccessResponse<T> {
  return { ok: true, body, message };
}

/** Factory helper — use in exception filters / error paths. */
export function failResponse(message: string, errors?: string[]): ErrorResponse {
  return { ok: false, body: null, message, ...(errors ? { errors } : {}) };
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
