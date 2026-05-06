import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PaginationDto } from '../common/common.dto';
import { DocumentStatus } from '../common/common.enum';
import { LicensingRegulatoryBody } from './licensing-info.enums';

export class CreateLicensingInfoControllerDto {
  @ApiPropertyOptional({ nullable: true })
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ nullable: true, enum: LicensingRegulatoryBody })
  @IsNotEmpty()
  @IsEnum(LicensingRegulatoryBody)
  regulatoryBody: LicensingRegulatoryBody;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  @Type(() => Number)
  agentId: number;
}

export class CreateLicensingInfoDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  agentId: number;

  @ApiPropertyOptional({ nullable: true, enum: LicensingRegulatoryBody })
  @IsNotEmpty()
  @IsEnum(LicensingRegulatoryBody)
  regulatoryBody: LicensingRegulatoryBody;

  @ApiPropertyOptional({ nullable: true })
  url: string;

  @ApiPropertyOptional({ nullable: false })
  @IsOptional()
  @IsNumber()
  size?: number;
}

export class BulkCreateLicensingInfoDocumentSingleDto {
  @ApiPropertyOptional({ nullable: true, enum: LicensingRegulatoryBody, example: LicensingRegulatoryBody.CAC_CERTIFICATE })
  @IsNotEmpty()
  @IsEnum(LicensingRegulatoryBody)
  regulatoryBody: LicensingRegulatoryBody;

  @ApiPropertyOptional({ nullable: true, example: 'https://safe-document.pdf' })
  url: string;

  @ApiPropertyOptional({ nullable: false, example: 4553300 })
  @IsOptional()
  @IsNumber()
  size?: number;
}

export class UpdateLicensingInfoDto {
  @ApiPropertyOptional({ nullable: true, enum: LicensingRegulatoryBody })
  @IsOptional()
  @IsEnum(LicensingRegulatoryBody)
  regulatoryBody?: LicensingRegulatoryBody;

  @ApiPropertyOptional({ nullable: true })
  url?: string;
}

export class LicensingInfoReuploadDto extends UpdateLicensingInfoDto {
}

export class UpdatePublicationStatusDto {
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

export class LicensingInfoPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by agent ID', example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  agentId?: number;

  @ApiPropertyOptional({ description: 'Filter records created on or after this date (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ description: 'Filter records created on or before this date (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  to?: string;
}
