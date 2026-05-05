import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../referral/referral.entity';
import { Payment } from '../payment/payment.entity';
import { Commission } from '../commission/commission.entity';
import { Agent } from '../agent/agent.entity';
import { PaymentStatus } from '../payment/payment.enums';
import { AgentConfigurationService } from '../agent-configuration/agent-configuration.service';
import { AgentDashboardMetricsDto, BonusTierProgressDto } from './analytics.dto';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Referral)
        private readonly referralRepository: Repository<Referral>,

        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(Commission)
        private readonly commissionRepository: Repository<Commission>,

        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,

        private readonly agentConfigurationService: AgentConfigurationService,
    ) { }

    async getDashboardMetrics(agentId: number): Promise<AgentDashboardMetricsDto> {
        const agent = await this.agentRepository.findOne({ where: { id: agentId } });
        if (!agent) {
            throw new NotFoundException(`Agent #${agentId} not found`);
        }

        const [
            totalCustomers,
            salesStats,
            commissionsTotal,
        ] = await Promise.all([
            this.getTotalCustomers(agentId),
            this.getSalesStats(agentId),
            this.getTotalCommissions(agentId),
        ]);

        const bonusTierProgress = await this.getBonusTierProgress(
            agent.agentType,
            salesStats.totalAssetValue,
        );

        return {
            totalCustomers,
            totalSalesCount: salesStats.totalSalesCount,
            totalSalesAmount: salesStats.totalSalesAmount,
            totalAssetValue: salesStats.totalAssetValue,
            totalCommissions: commissionsTotal,
            bonusTierProgress,
        };
    }

    private async getTotalCustomers(agentId: number): Promise<number> {
        return this.referralRepository.count({ where: { referrerId: agentId } });
    }

    private async getSalesStats(agentId: number): Promise<{
        totalSalesCount: number;
        totalSalesAmount: number;
        totalAssetValue: number;
    }> {
        const result = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('COUNT(payment.id)', 'totalSalesCount')
            .addSelect('COALESCE(SUM(payment.amount), 0)', 'totalSalesAmount')
            .addSelect('COALESCE(SUM(COALESCE(payment.property_value, payment.amount)), 0)', 'totalAssetValue')
            .where('payment.agentId = :agentId', { agentId })
            .andWhere('payment.status = :status', { status: PaymentStatus.SUCCESSFUL })
            .getRawOne<{
                totalSalesCount: string;
                totalSalesAmount: string;
                totalAssetValue: string;
            }>();

        return {
            totalSalesCount: Number(result?.totalSalesCount ?? 0),
            totalSalesAmount: Number(result?.totalSalesAmount ?? 0),
            totalAssetValue: Number(result?.totalAssetValue ?? 0),
        };
    }

    private async getTotalCommissions(agentId: number): Promise<number> {
        const result = await this.commissionRepository
            .createQueryBuilder('commission')
            .leftJoin('commission.referral', 'referral')
            .select('COALESCE(SUM(commission.amount), 0)', 'total')
            .where('referral.referrerId = :agentId', { agentId })
            .getRawOne<{ total: string }>();

        return Number(result?.total ?? 0);
    }

    private async getBonusTierProgress(
        agentType: string,
        totalAssetValue: number,
    ): Promise<BonusTierProgressDto> {
        try {
            const config = await this.agentConfigurationService.findByAgentType(agentType as any);

            const tier1Threshold = Number(config.bonusTier1Threshold);
            const tier2Threshold = Number(config.bonusTier2Threshold);
            const tier1Rate = Number(config.bonusTier1Rate);
            const tier2Rate = Number(config.bonusTier2Rate);

            if (totalAssetValue >= tier2Threshold) {
                return {
                    currentTier: 2,
                    currentBonusRate: tier2Rate,
                    nextTierThreshold: null,
                    nextTierRate: null,
                    nextTierProgress: 1,
                };
            }

            if (totalAssetValue >= tier1Threshold) {
                return {
                    currentTier: 1,
                    currentBonusRate: tier1Rate,
                    nextTierThreshold: tier2Threshold,
                    nextTierRate: tier2Rate,
                    nextTierProgress: Math.min(totalAssetValue / tier2Threshold, 1),
                };
            }

            return {
                currentTier: 0,
                currentBonusRate: 0,
                nextTierThreshold: tier1Threshold,
                nextTierRate: tier1Rate,
                nextTierProgress: tier1Threshold > 0
                    ? Math.min(totalAssetValue / tier1Threshold, 1)
                    : 0,
            };
        } catch {
            // No config seeded yet
            return {
                currentTier: 0,
                currentBonusRate: 0,
                nextTierThreshold: null,
                nextTierRate: null,
                nextTierProgress: 0,
            };
        }
    }
}
