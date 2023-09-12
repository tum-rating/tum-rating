import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';

import {
  ReviewUserUnique,
  ReviewUserUniqueDocument,
} from 'src/database/documents/reviewUserUnique';

import { BaseRepository } from './base.repository';

export class ReviewuserUniqueRepository extends BaseRepository<ReviewUserUnique> {
  constructor(
    @InjectModel(ReviewUserUnique.name)
    private readonly _reviewUserUnique: Model<ReviewUserUniqueDocument>,
  ) {
    super(_reviewUserUnique);
  }

  public async getOneByUserIdAndReviewId(
    userId: string,
    reviewId: string,
  ) {
    return this._reviewUserUnique
      .findOne({
        userId,
        reviewId,
      })
  }

  public async deleteOneByUserIdAndReviewId(userId: string, reviewId: string) {
    return this._reviewUserUnique.deleteOne({ userId, reviewId });
  }
}
