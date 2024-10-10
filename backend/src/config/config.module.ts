import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import AppConfig from './app.config';
import CacheConfig from './cache.config';
import JWTConfig from './jwt.config';
import MailerConfig from './mailer.config';
import MongoConfig from './mongo.config';
import OAuthConfig from './oauth.config';
import SignUpConfig from './signup.config';
import WebappConfig from './webapp.config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [
                AppConfig,
                CacheConfig,
                JWTConfig,
                MailerConfig,
                MongoConfig,
                OAuthConfig,
                SignUpConfig,
                WebappConfig
            ],
        }),
    ],
})
export class ConfigModule {}
