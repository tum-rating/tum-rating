import { Module } from '@nestjs/common';

import { ConfigModule } from 'src/config/config.module';
import { MongoModule } from 'src/database/mongo.module';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    MongoModule,

	AuthModule,
	UserModule
  ]
})
export class AppModule {}
