import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review, ReviewSchema } from 'src/database/documents/review';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { ReviewUser, ReviewUserSchema } from 'src/database/documents/reviewUser';
import { UserModule } from 'src/modules/user/user.module';
import { ReviewUserRepository } from 'src/database/repositories/reviewUser.repository';

import { ReviewControllerV1 } from './review.controller.v1';
import { ReviewService } from './review.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: ReviewUser.name, schema: ReviewUserSchema },
        ]),
        UserModule,
    ],
    controllers: [ReviewControllerV1],
    providers: [JWTService, ReviewService, ReviewRepository, ReviewUserRepository, Logger],
    exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
