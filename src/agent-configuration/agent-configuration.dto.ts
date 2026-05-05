import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AgentType } from '../agent/agent.enums';

export class UpdateAgentConfigurationDto {
    @ApiProperty({ example: 0.05, description: 'Commission rate, e.g. 0.05 = 5%' })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    commissionRate: number;

    @ApiProperty({ example: 50000000, description: 'Minimum total property value sold for Tier 1 bonus' })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    bonusTier1Threshold: number;

    @ApiProperty({ example: 0.02, description: 'Bonus rate at Tier 1, e.g. 0.02 = 2%' })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    bonusTier1Rate: number;

    @ApiProperty({ example: 100000000, description: 'Minimum total property value sold for Tier 2 bonus' })
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    bonusTier2Threshold: number;

    @ApiProperty({ example: 0.05, description: 'Bonus rate at Tier 2, e.g. 0.05 = 5%' })
    @IsNumber()
    @Min(0)
    @Max(1)
    @Type(() => Number)
    bonusTier2Rate: number;
}
