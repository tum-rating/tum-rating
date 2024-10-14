import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Toggle, ToggleSchema } from 'src/database/documents/toggle';
import { UserModule } from 'src/modules/user/user.module';
import { ToggleRepository } from 'src/database/repositories/toggle.repository';
import { JWTService } from 'src/utils/jwt/jwt.service';

import { ToggleAdminControllerV1 } from './toggle.controller.admin.v1';
import { ToggleControllerV1 } from './toggle.controller.v1';
import { ToggleService } from './toggle.services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Toggle.name, schema: ToggleSchema },
        ]),
        UserModule,
    ],
    controllers: [ToggleAdminControllerV1, ToggleControllerV1],
    providers: [JWTService, ToggleService, ToggleRepository, Logger],
    exports: [ToggleService],
})
export class ToggleModule {}
