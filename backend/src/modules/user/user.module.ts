import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { User, UserSchema } from 'src/database/documents/user';
import { JWTService } from 'src/utils/jwt/jwt.service';

import { UserControllerV1 } from './user.controller.v1';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserControllerV1],
    providers: [JWTService, UserService, UserRepository, Logger],
    exports: [UserService],
})
export class UserModule {}
