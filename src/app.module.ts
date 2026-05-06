import { ConfigModule } from '@nestjs/config';

// https://stackoverflow.com/a/71045457/6132438
// Moved here to fix a bug (env not being loaded early enough)
import * as Joi from 'joi';

const envModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    // APP
    PORT: Joi.number().port().default(3000),

    // DB
    DB_HOST: Joi.string(),
    DB_NAME: Joi.string(),
    DB_PORT: Joi.number().port().default(3306),
    DB_USERNAME: Joi.string(),
    // DB_PASSWORD: ,

    // AUTH
    JWT_SECRET: Joi.string(),
    REFRESH_TOKEN_SECRET: Joi.string(),

    // S3
    AWS_S3_BUCKET_NAME: Joi.string(),
    AWS_S3_ACCESS_KEY_ID: Joi.string(),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string(),
    AWS_S3_REGION: Joi.string(),
  }),
  envFilePath: '.env',
  isGlobal: true,
});

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AccessLoggerMiddleware } from './common/middleware/AccessLoggerMiddleware';
import { UserModule } from './user/user.module';
import { AgentModule } from './agent/agent.module';
import { AgentDocumentModule } from './agent-document/agent-document.module';
import { LicensingInfoModule } from './licensing-info/licensing-info.module';
import { ReferralModule } from './referral/referral.module';
import { CommissionModule } from './commission/commission.module';
import { options } from './data-source';
import { AppController } from './app.controller';
import { NotificationModule } from './notification/notification.module';
import { AgentPocModule } from './agent-poc/agent-poc.module';
import { CaslModule } from './common/casl/casl.module';
import { AgentConfigurationModule } from './agent-configuration/agent-configuration.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CampaignModule } from './campaign/campaign.module';
import { AgentTypeModule } from './agent-type/agent-type.module';

@Module({
  imports: [
    envModule,
    TypeOrmModule.forRoot(options as TypeOrmModuleOptions),
    UserModule,
    AgentModule,
    AgentDocumentModule,
    LicensingInfoModule,
    ReferralModule,
    CommissionModule,
    NotificationModule,
    AgentPocModule,
    CaslModule,
    AgentConfigurationModule,
    AgentTypeModule,
    CampaignModule,
    WalletModule,
    PaymentModule,
    TransactionModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessLoggerMiddleware)
      .forRoutes('*');
  }
}
