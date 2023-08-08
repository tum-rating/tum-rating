import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import AppConfig from './app.config';
import GoogleAuthConfig from './google-auth.config';
import JWTConfig from './jwt.config';
import MailerConfig from './mailer.config';
import MongoConfig from './mongo.config';
// import WebappConfig from './webapp.config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [
                AppConfig,
                GoogleAuthConfig,
                JWTConfig,
                MailerConfig,
                MongoConfig,
                // WebappConfig,
            ],
        }),
    ],
})
export class ConfigModule {}
