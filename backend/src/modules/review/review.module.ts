import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review, ReviewSchema } from 'src/database/documents/Review';
import { JWTService } from 'src/utils/jwt/jwt.service';
import {
  ReviewUserUnique,
  ReviewUserUniqueSchema,
} from 'src/database/documents/reviewUserUnique';
import { ReviewuserUniqueRepository } from 'src/database/repositories/reviewUserUnique';

import { ReviewControllerV1 } from './review.controller.v1';
import { ReviewService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: ReviewUserUnique.name, schema: ReviewUserUniqueSchema },
    ]),
  ],
  controllers: [ReviewControllerV1],
  providers: [
    JWTService,
    ReviewService,
    ReviewRepository,
    ReviewuserUniqueRepository,
    Logger,
  ],
  exports: [
    ReviewService,
    ReviewRepository
  ],
})
export class ReviewModule {}
