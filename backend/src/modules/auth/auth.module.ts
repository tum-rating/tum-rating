import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
// import { ServiceConfigModule } from 'src/config/config.module';
import { User } from 'src/database/documents/user';
// import { UserRepository } from 'src/database/repositories';
import { UserService } from 'src/modules/user/user.service';
import { JWTService } from 'src/utils/jwt/jwt.service';

import { AuthControllerV1 } from './auth.controller.v1';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
// import { MailerModule } from '../mailer/mailer.module';
// import { GoogleAuthenticationService } from './google.authentication.service';

@Module({
	imports: [
		UserModule,
		// MailerModule,
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
