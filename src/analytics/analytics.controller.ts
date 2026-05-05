import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AgentDashboardMetricsDto } from './analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('agent/:agentId')
    getDashboardMetrics(
        @Param('agentId', ParseIntPipe) agentId: number,
    ): Promise<AgentDashboardMetricsDto> {
        return this.analyticsService.getDashboardMetrics(agentId);
    }
}
