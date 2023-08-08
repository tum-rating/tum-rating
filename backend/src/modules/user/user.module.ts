import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { User, UserSchema } from 'src/database/documents/user';

import { UserControllerV1 } from './user.controller.v1';
import { UserService } from './user.service';

@Module({
	imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [UserControllerV1],
	providers: [
		UserService,
		UserRepository
	],
    exports: [
        UserService
    ]
})
export class UserModule {}
