import { InjectModel } from '@nestjs/mongoose';
import  { Model, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

import { ReviewUser, ReviewUserDocument } from 'src/database/documents/reviewUser';

import { BaseRepository } from './base.repository';

export type CreateReviewUserType = Pick<
  ReviewUser,
  'userId' | 'userName' | 'reviewId' | 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'
>;

export type PatchReviewUserType = Partial<Pick<
  ReviewUser,
  'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'
>>;

export class ReviewUserRepository extends BaseRepository<ReviewUser> {
  constructor(
    @InjectModel(ReviewUser.name)
    private readonly _reviewUserModel: Model<ReviewUserDocument>,
  ) {
    super(_reviewUserModel);
  }

  public async create(reviewUser: CreateReviewUserType) {
    return super.create(reviewUser as ReviewUser);
  }

  public async updateOneByUserIdAndReviewId(userId: string, reviewId: string, reviewUser: PatchReviewUserType) {
    const result = await this._reviewUserModel.findOneAndUpdate({userId, reviewId},
      {
        ...reviewUser,
        updatedAt: new Date()
      }, {new: true});

      console.log('results', result)

    return result;
  }

  public async deleteOneByUserIdAndReviewId(userId: string, reviewId: string) {
    return this._reviewUserModel.deleteOne({ userId, reviewId });
  }

  public async getStatsByReviewId(reviewId: string) {
    const result = await this._reviewUserModel.aggregate([
      { $match: { reviewId: new mongoose.Types.ObjectId(reviewId) }},
      {
        $group: {
          _id: 1,
          howInterestingRating: { $avg: '$howInterestingRating' },
          howEasyRating: { $avg: '$howEasyRating' },
          count: { $sum: 1 }, 
        },
      }
    ]);

    return {
      howInterestingRatingAverage: result[0].howInterestingRating,
      howEasyRatingAverage: result[0].howEasyRating,
      votesNumber: result[0].count,
    }
  }
}
