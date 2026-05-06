import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';

export class CampaignRateInputDto {
    @ApiProperty({ example: 'QSHELTER_LICENSED' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    agentTypeCode: string;

    @ApiProperty({ example: 0.075 })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    commissionRate: number;
}

export class CreateCampaignDto {
    @ApiProperty({ example: 'Rainy Season Push' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiPropertyOptional({ example: 'Short-term higher commission campaign for licensed agents.' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: true, default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 10, default: 0 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    priority?: number;

    @ApiPropertyOptional({ example: '2026-05-01T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    startsAt?: string;

    @ApiPropertyOptional({ example: '2026-06-01T23:59:59.999Z' })
    @IsOptional()
    @IsDateString()
    endsAt?: string;

    @ApiPropertyOptional({ type: [Number], example: [1, 2, 3] })
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    @IsPositive({ each: true })
    agentIds?: number[];

    @ApiPropertyOptional({ type: [CampaignRateInputDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CampaignRateInputDto)
    rates?: CampaignRateInputDto[];
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) { }

export class AssignCampaignAgentsDto {
    @ApiProperty({ type: [Number], example: [1, 2, 3] })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsPositive({ each: true })
    agentIds: number[];
}

export class UpsertCampaignRateDto {
    @ApiProperty({ example: 0.08 })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    commissionRate: number;
}
