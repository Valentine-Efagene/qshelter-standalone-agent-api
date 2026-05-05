import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BonusTierProgressDto {
    @ApiProperty({ description: 'Current tier the agent qualifies for (0 = no tier)', example: 1 })
    currentTier: 0 | 1 | 2;

    @ApiProperty({ description: 'Bonus rate at the current tier (0 if no tier met)', example: 0.02 })
    currentBonusRate: number;

    @ApiPropertyOptional({ description: 'Property value threshold to reach the next tier (null if already at max tier)', example: 100000000 })
    nextTierThreshold: number | null;

    @ApiPropertyOptional({ description: 'Bonus rate at the next tier (null if already at max tier)', example: 0.05 })
    nextTierRate: number | null;

    @ApiProperty({ description: 'Progress toward next tier threshold as a fraction (0–1)', example: 0.63 })
    nextTierProgress: number;
}

export class AgentDashboardMetricsDto {
    @ApiProperty({ description: 'Total number of customers (users) referred by the agent' })
    totalCustomers: number;

    @ApiProperty({ description: 'Count of successful payments linked to the agent' })
    totalSalesCount: number;

    @ApiProperty({ description: 'Sum of all successful payment amounts received via the agent' })
    totalSalesAmount: number;

    @ApiProperty({ description: 'Sum of total property values sold via the agent (used for bonus tier calculation)' })
    totalAssetValue: number;

    @ApiProperty({ description: 'Sum of all commission amounts earned by the agent' })
    totalCommissions: number;

    @ApiProperty({ type: () => BonusTierProgressDto })
    bonusTierProgress: BonusTierProgressDto;
}
