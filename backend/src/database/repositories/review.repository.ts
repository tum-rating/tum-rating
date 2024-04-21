import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

import { Review, ReviewDocument } from 'src/database/documents/review';

import { BaseRepository } from './base.repository';

export type CreateReviewType = Pick<Review, 'userId' | 'userName' | 'courseId' | 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'>;

export type PatchReviewType = Partial<Pick<Review, 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'>>;

export class ReviewRepository extends BaseRepository<Review> {
    constructor(
        @InjectModel(Review.name)
        private readonly _reviewModel: Model<ReviewDocument>,
    ) {
        super(_reviewModel);
    }

    public async create(review: CreateReviewType) {
        return super.create(review as Review);
    }

    public async getOneByCourseIdAndUserId(courseId: string, userId: string) {
        return this._reviewModel.findOne({ courseId, userId });
    }

    public async updateOneByUserIdAndCourseId(userId: string, courseId: string, review: PatchReviewType) {
        const result = await this._reviewModel.findOneAndUpdate(
            { userId, courseId },
            {
                ...review,
                updatedAt: new Date(),
            },
            { new: true },
        );

        return result;
    }

    public async deleteOneByUserIdAndCourseId(userId: string, courseId: string) {
        return this._reviewModel.deleteOne({ userId, courseId });
    }

    public async getStatsByCourseId(courseId: string) {
        const result = await this._reviewModel.aggregate([
            { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
            {
                $group: {
                    _id: 1,
                    howInterestingRating: { $avg: '$howInterestingRating' },
                    howEasyRating: { $avg: '$howEasyRating' },
                    count: { $sum: 1 },
                },
            },
            { 
                $project: { 
                    _id: 1, 
                    howInterestingRating: { $round: ['$howInterestingRating', 2] }, 
                    howEasyRating: { $round: ['$howEasyRating', 2] }, 
                    count: 1 
                } 
            }
        ]);

        return {
            howInterestingRatingAverage: result[0].howInterestingRating,
            howEasyRatingAverage: result[0].howEasyRating,
            votesNumber: result[0].count,
        };
    }
}
