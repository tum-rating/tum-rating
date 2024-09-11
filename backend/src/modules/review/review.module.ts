import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/database/documents/review';
import { UserModule } from 'src/modules/user/user.module';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { JWTService } from 'src/utils/jwt/jwt.service';

import { ReviewAdminControllerV1 } from './review.controller.admin.v1';
import { ReviewService } from './review.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
        ]),
        UserModule,
    ],
    controllers: [ReviewAdminControllerV1],
    providers: [JWTService, ReviewService, ReviewRepository, Logger],
    exports: [ReviewService],
})
export class ReviewModule {}
