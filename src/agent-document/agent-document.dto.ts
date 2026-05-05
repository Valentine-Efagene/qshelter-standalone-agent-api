import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { DocumentStatus } from '../common/common.enum';

export class CreateAgentDocumentResolverDto {
  @ApiProperty({ nullable: true, example: 1 })
  licensingInfoId: number;

  @ApiPropertyOptional({ nullable: true })
  name: string;

  @ApiPropertyOptional({ nullable: true })
  description: string;
}

export class CreateAgentDocumentDto {
  @ApiProperty({ nullable: true, example: 1 })
  licensingInfoId: number;

  @ApiPropertyOptional({ nullable: true })
  name: string;

  @ApiPropertyOptional({ nullable: true })
  description: string;

  @ApiPropertyOptional({ nullable: true })
  url: string;

  @ApiProperty({ nullable: false })
  @IsNotEmpty()
  @IsNumber()
  size: number;
}

export class UpdateAgentDocumentDto {
  @ApiPropertyOptional({ nullable: true })
  name?: string;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Optional new description for the file',
  })
  description?: string;

  @ApiPropertyOptional({ nullable: true })
  url?: string;
}

export class AgentDocumentReuploadDto extends UpdateAgentDocumentDto {
}

export class UpdateAgentDocumentStatusDto {
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
  declineReason?: string;

  @ApiProperty({ nullable: false, example: 1 })
  @IsNotEmpty()
  reviewerId: number;
}
