import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

import { ConfigModule } from 'src/config/config.module';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { MongoModule } from 'src/database/mongo.module';
import { LoggerModule } from 'src/utils/logger/logger.module';

import { AuthModule } from './modules/auth/auth.module';
import { FrontendModule } from './modules/frontend-serve/frontendServe.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { ReviewModule } from './modules/review/review.module';
import { ReviewProposalModule } from './modules/review-proposal/reviewProposal.module';

@Module({
  imports: [
    ConfigModule,
    MailerModule,
    MongoModule,
    LoggerModule,

    AuthModule,
    FrontendModule,
    HealthModule,
    UserModule,
    ReviewModule,
    ReviewProposalModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
