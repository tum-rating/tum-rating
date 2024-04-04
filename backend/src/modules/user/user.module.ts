import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/database/repositories/user.repository';
import { UserBanRepository } from 'src/database/repositories/userBan.repository';
import { User, UserSchema } from 'src/database/documents/user';
import { UserBan, UserBanSchema } from 'src/database/documents/userBan';
import { JWTService } from 'src/utils/jwt/jwt.service';

import { UserControllerV1 } from './user.controller.v1';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: UserBan.name, schema: UserBanSchema }
    ])],
    controllers: [UserControllerV1],
    providers: [
        Logger,
        JWTService,

        UserService,

        UserRepository,
        UserBanRepository,
    ],
    exports: [UserService],
})
export class UserModule {}
