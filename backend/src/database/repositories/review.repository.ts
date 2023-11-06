import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  Review,
  ReviewDocument,
  UserReview,
} from 'src/database/documents/review';
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

    // align page number with index 0
    const alignedPageNumber = pageNumber - 1;

    return this._reviewModel.find(query)
      .sort({course: 1})
      .select('-reviews -__v')
      .skip(alignedPageNumber * pageSize)
      .limit(pageSize);
  }

  public async getById(id: string) {
    return this._reviewModel.findById(id).select('-__v');
  }

  public async addUserReview(
    userReview: Pick<
      UserReview,
      'userId' | 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'
    >,
    reviewId: string,
    session?: ClientSession,
  ) {
    return this._reviewModel.findOneAndUpdate({_id: reviewId, offeredInSemesters: userReview.semester}, {
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
              $trunc: [ { $avg: '$reviews.howInterestingRating' }, 2 ],
            },
            howEasyAvg: { $trunc: [ { $avg: '$reviews.howEasyRating' }, 2 ]},
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

  public async putUserReview(userId: string, reviewId: string, putUserReview: UserReview) {
    return this._reviewModel.findOneAndUpdate({
      _id: reviewId,
      offeredInSemesters: putUserReview.semester,
      'reviews.userId': userId
    }, {
      $set: {'reviews.$': putUserReview}
    });
  }
}
