import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  Review,
  ReviewDocument,
  UserReview,
} from 'src/database/documents/Review';
import { BaseRepository } from './base.repository';
import * as mongoose from 'mongoose';

export class ReviewRepository extends BaseRepository<Review> {
  constructor(
    @InjectModel(Review.name)
    private readonly _reviewModel: Model<ReviewDocument>,
  ) {
    super(_reviewModel);
  }

  public async getSession() {
    return this._reviewModel.startSession();
  }

  public async findAllOverview() {
    return this._reviewModel.find().select('-reviews -__v');
  }

  public async getReviewsByQuery(pageNumber: number, pageSize: number, search?: string) {
    // rage base pagination - think how to combine with text search, for now good enough
    // let query = {_id: {$gt: pageId}}

    let query = {};

    if(search) {
      query['$text'] = {$search: search}
    }

    console.log('query: ', query);

    return this._reviewModel.find(query)
      .sort({course: 1})
      .select('-reviews -__v')
      .skip(pageNumber * pageSize)
      .limit(pageSize);
  }

  public async getById(id: string) {
    return this._reviewModel.findById(id).select('-__v');
  }

  public async addUserReview(
    userReview: Pick<
      UserReview,
      'userId' | 'howEasyRating' | 'howInterestingRating' | 'comment'
    >,
    reviewId: string,
    session?: ClientSession,
  ) {
    return this._reviewModel.findByIdAndUpdate(reviewId, {
      $push: { reviews: userReview },
    });
  }

  public async updateReviewStats(reviewId: string) {
    return this._reviewModel
      .aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(reviewId) },
        },
        {
          $project: {
            _id: 1,
            reviews: 1,
            howInteresingAvg: {
              $trunc: { $avg: '$reviews.howInterestingRating' },
            },
            howEasyAvg: { $trunc: { $avg: '$reviews.howEasyRating' } },
            votesNumber: { $size: '$reviews' },
          },
        },
        {
          $project: {
            _id: 1,
            howInterestingRatingAverage: '$howInteresingAvg',
            howEasyRatingAverage: '$howEasyAvg',
            votesNumber: '$votesNumber',
          },
        },
        {
          $merge: {
            into: 'reviews',
            on: '_id',
            whenMatched: 'merge',
            whenNotMatched: 'fail',
          },
        },
      ])
      .exec();
  }
}
