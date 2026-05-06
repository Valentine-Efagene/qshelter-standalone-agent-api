import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentIdType, AgentStatus, AgentType } from './agent.enums';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Agent } from './agent.entity';
import { PaginationDto, PaginationMeta } from '../common/common.dto';
import { BulkCreateLicensingInfoDocumentSingleDto } from '../licensing-info/licensing-info.dto';
import IsNotForQShelterLicensed from '../common/validation/IsNotForQShelterLicensed';
import IsRequiredForElitePartner from '../common/validation/IsRequiredForElitePartner';
import { BulkCreateAgentPocDto } from '../agent-poc/agent-poc.dto';

export class CreateAgentDto {
  @ApiProperty({ nullable: true, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: AgentType.QSHELTER_LICENSED })
  @IsNotEmpty()
  @MaxLength(255)
  agentType: AgentType;

  @ApiProperty({
    example: 'Mr',
  })
  @IsOptional()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Johnny Ufuoma',
  })
  @IsOptional()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: '06045362536',
  })
  @MaxLength(255)
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    example: '06045362536',
  })
  @IsOptional()
  @MaxLength(255)
  phone2?: string;

  // COMPANY FIELDS
  @ApiPropertyOptional({
    example: 'pwC',
  })
  @IsRequiredForElitePartner()
  @IsNotForQShelterLicensed()
  companyName?: string;

  @ApiPropertyOptional({
    example: '45362536',
  })
  @IsRequiredForElitePartner()
  @IsNotForQShelterLicensed()
  rcNumber?: string;

  @ApiPropertyOptional({
    example: 'company@testmail.com',
  })
  @IsRequiredForElitePartner()
  @IsNotForQShelterLicensed()
  companyEmail?: string;

  @ApiPropertyOptional({
    example: '06045362536',
  })
  @IsRequiredForElitePartner()
  @IsNotForQShelterLicensed()
  companyPhone?: string;

  // COMPANY FIELDS END

  @ApiPropertyOptional({
    example: 'Access Bank Plc',
  })
  @IsOptional()
  @MaxLength(255)
  bankName?: string;

  @ApiPropertyOptional({
    example: 'Johnny Ufuoma',
  })
  @IsOptional()
  @MaxLength(255)
  accountName?: string;

  @ApiPropertyOptional({
    example: '948409362536',
  })
  @IsOptional()
  @MaxLength(255)
  accountNumber?: string;

  @ApiPropertyOptional({
    enum: AgentIdType,
    example: AgentIdType.NIN,
  })
  @IsOptional()
  @IsEnum(AgentIdType)
  idType?: AgentIdType;

  @ApiPropertyOptional({
    example: 'https://example.com/documents/nin.png',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  idDocument?: string;

  @ApiPropertyOptional({
    example: '12345678901',
  })
  @IsOptional()
  @MaxLength(255)
  idNumber?: string;

  @ApiProperty({
    example: 'Nigeria',
  })
  @IsNotEmpty()
  @MaxLength(255)
  countryOfResidence: string;

  @ApiProperty({
    example: 'Rivers',
  })
  @IsNotEmpty()
  @MaxLength(255)
  state: string;

  referralCode?: string

  @ApiProperty({
    example: 'Port Harcourt',
  })
  @IsNotEmpty()
  @MaxLength(255)
  city: string;

  @ApiPropertyOptional({ type: [BulkCreateLicensingInfoDocumentSingleDto], description: 'Licensing Info' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkCreateLicensingInfoDocumentSingleDto)
  licensingInfo?: BulkCreateLicensingInfoDocumentSingleDto[];

  @ApiPropertyOptional({ type: BulkCreateAgentPocDto, description: 'Agent POC' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BulkCreateAgentPocDto)
  poc?: BulkCreateAgentPocDto;
}

export class UpdateAgentStatusDto {
  @ApiProperty({
    nullable: false,
    enum: AgentStatus,
    example: AgentStatus.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(AgentStatus)
  status: AgentStatus;

  @ApiPropertyOptional({
    description: 'Required for declines',
  })
  @IsOptional()
  comment?: string;

  @ApiProperty({ nullable: false, example: 1 })
  @IsNotEmpty()
  reviewerId: number;
}

export class UpdateAgentDto {
  @ApiProperty({ nullable: true, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiPropertyOptional({ example: AgentType.QSHELTER_LICENSED })
  @MaxLength(255)
  @IsOptional()
  agentType?: AgentType;

  @ApiPropertyOptional({
    example: 'Mr',
  })
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Johnny Ufuoma',
  })
  @MaxLength(255)
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    example: '06045362536',
  })
  @MaxLength(255)
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    example: '06045362536',
  })
  @MaxLength(255)
  @IsOptional()
  phone2: string;

  @ApiPropertyOptional({
    example: 'pwC',
  })
  @MaxLength(255)
  @IsOptional()
  companyName: string;

  @ApiPropertyOptional({
    example: '45362536',
  })
  @MaxLength(255)
  @IsOptional()
  rcNumber: string;

  @ApiPropertyOptional({
    example: 'company@testmail.com',
  })
  @MaxLength(255)
  @IsOptional()
  companyEmail: string;

  @ApiPropertyOptional({
    example: '06045362536',
  })
  @MaxLength(255)
  @IsOptional()
  companyPhone: string;

  @ApiPropertyOptional({
    example: 'Access Bank Plc',
  })
  @MaxLength(255)
  @IsOptional()
  bankName: string;

  @ApiPropertyOptional({
    example: 'Johnny Ufuoma',
  })
  @MaxLength(255)
  @IsOptional()
  accountName: string;

  @ApiPropertyOptional({
    example: '948409362536',
  })
  @IsOptional()
  @MaxLength(255)
  accountNumber: string;

  @ApiPropertyOptional({
    enum: AgentIdType,
    example: AgentIdType.NIN,
  })
  @IsOptional()
  @IsEnum(AgentIdType)
  idType?: AgentIdType;

  @ApiPropertyOptional({
    example: 'https://example.com/documents/nin.png',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  idDocument?: string;

  @ApiPropertyOptional({
    example: '12345678901',
  })
  @IsOptional()
  @MaxLength(255)
  idNumber?: string;

  @ApiPropertyOptional({
    example: 'Nigeria',
  })
  @IsOptional()
  @MaxLength(255)
  countryOfResidence: string;

  @ApiPropertyOptional({
    example: 'Rivers',
  })
  @IsOptional()
  @MaxLength(255)
  state: string;

  @ApiPropertyOptional({
    example: 'Port Harcourt',
  })
  @IsOptional()
  @MaxLength(255)
  city: string;
}

export class PaginatedAgents {
  data: Agent[];

  meta: PaginationMeta;
}

export class ReferreePaginationDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter referrals created on or after this date (ISO 8601)',
    example: '2025-01-01',
  })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter referrals created on or before this date (ISO 8601)',
    example: '2025-12-31',
  })
  @IsOptional()
  to?: string;

}

export class AgentPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ enum: AgentStatus, description: 'Filter by onboarding status' })
  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;

  @ApiPropertyOptional({ enum: AgentType, description: 'Filter by agent type' })
  @IsOptional()
  @IsEnum(AgentType)
  agentType?: AgentType;

  @ApiPropertyOptional({ description: 'Filter agents created on or after this date (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ description: 'Filter agents created on or before this date (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  to?: string;
}

