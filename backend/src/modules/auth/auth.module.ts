import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JWTService } from 'src/utils/jwt/jwt.service';

import { AuthControllerV1 } from './auth.controller.v1';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { MailerModule } from 'src/modules/mailer/mailer.module';

@Module({
	imports: [
		UserModule,
		MailerModule
	],
	controllers: [AuthControllerV1],
	providers: [
		AuthService,
        JWTService,
        Logger
	],
	exports: [AuthService]
})
export class AuthModule {}
