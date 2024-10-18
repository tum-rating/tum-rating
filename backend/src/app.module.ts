import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

import { CacheModule } from 'src/utils/cache/cache.module';
import { ConfigModule } from 'src/config/config.module';
import { MailerModule } from 'src/modules/mailer/mailer.module';
import { MongoModule } from 'src/database/mongo.module';
import { LoggerModule } from 'src/utils/logger/logger.module';

import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { FrontendModule } from './modules/frontend-serve/frontendServe.module';
import { HealthModule } from './modules/health/health.module';
import { UserModule } from './modules/user/user.module';
import { CourseModule } from './modules/course/course.module';
import { CourseProposalModule } from './modules/course-proposal/courseProposal.module';
import { ReviewModule } from './modules/review/review.module';
import { ToggleModule } from './modules/toggle/toggle.module';

@Module({
    imports: [
        CacheModule,
        ConfigModule,
        MailerModule,
        MongoModule,
        LoggerModule,

        AuthModule,
        ClientModule,
        FrontendModule,
        HealthModule,
        UserModule,
        CourseModule,
        CourseProposalModule,
        ReviewModule,
        ToggleModule
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
