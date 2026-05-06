import * as dotenv from 'dotenv';
import { User } from './user/user.entity';
import { Agent } from './agent/agent.entity';
import { AgentStatusReviewHistory } from './agent/agent-status-review-history.entity';
import { AgentTypeLookup } from './agent-type/agent-type.entity';
import { LicensingInfo } from './licensing-info/licensing-info.entity';
import { AgentDocument } from './agent-document/agent-document.entity';
import { Referral } from './referral/referral.entity';
import { Commission } from './commission/commission.entity';
import { CustomNamingStrategy } from './common/helpers/CustomNamingStrategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AgentPoc } from './agent-poc/agent-poc.entity';
import { AgentConfiguration } from './agent-configuration/agent-configuration.entity';
import { Campaign } from './campaign/campaign.entity';
import { CampaignAgent } from './campaign/campaign-agent.entity';
import { CampaignAgentTypeRate } from './campaign/campaign-agent-type-rate.entity';
import { Wallet } from './wallet/wallet.entity';
import { Payment } from './payment/payment.entity';
import { Transaction } from './transaction/transaction.entity';

if (process.env.NODE_ENV !== 'test') {
    dotenv.config();
}


// console.log('Using database', process.env.DB_NAME, process.env.NODE_ENV);

export const options: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT) ?? 3306,
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME,
    entities: [
        User,
        Agent,
        AgentStatusReviewHistory,
        AgentTypeLookup,
        LicensingInfo,
        AgentDocument,
        Referral,
        Commission,
        AgentPoc,
        AgentConfiguration,
        Campaign,
        CampaignAgent,
        CampaignAgentTypeRate,
        Wallet,
        Payment,
        Transaction,
    ],
    dropSchema: false,
    synchronize: false,
    migrationsRun: true,
    namingStrategy: new CustomNamingStrategy(),
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    // Connection pooling and optimization settings
    // extra: {
    //     connectionLimit: 10, // Maximum number of connections in pool
    //     acquireTimeout: 60000, // Maximum time to wait for a connection
    //     timeout: 60000, // Connection timeout
    //     reconnect: true, // Automatically reconnect on connection loss
    //     keepConnectionAlive: true,
    //     retryAttempts: 3,
    //     retryDelay: 3000,
    // },
}

export default new DataSource(options)