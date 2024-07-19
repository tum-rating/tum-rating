import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, ClientSession } from 'mongoose';
import * as mongoose from 'mongoose';

import { Review, ReviewDocument } from 'src/database/documents/review';
import { PaginationOptions } from 'src/utils/api/pagination';

import { BaseRepository } from './base.repository';
import { th } from '@faker-js/faker';

export type CreateReviewType = Pick<Review, 'userId' | 'userName' | 'courseId' | 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'>;

export type PatchReviewType = Partial<Pick<Review, 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'>>;

export type QueryOptions = {
    userId?: string;
};

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

    public async getPaginatedReviews(paginationOptions: PaginationOptions, queryOptions?: QueryOptions) {
        const alignedPageNumber = paginationOptions.pageNumber - 1;

        if (alignedPageNumber < 0) throw new Error('Page number must be greater than 0');

        return this._reviewModel
            .find(queryOptions)
            .skip(alignedPageNumber * paginationOptions.pageSize)
            .limit(paginationOptions.pageSize);
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

    public async getStatsByCourseId(courseId: string, session?: ClientSession) {
        const result = await this._reviewModel.aggregate([
            { $match: { courseId: new mongoose.Types.ObjectId(courseId), isHidden: false } },
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
        ], { session });

        return {
            howInterestingRatingAverage: result[0]?.howInterestingRating || 0,
            howEasyRatingAverage: result[0]?.howEasyRating || 0,
            votesNumber: result[0]?.count || 0,
        };
    }

    public async toggleReviewVisibilityByUserID(userId: string, hide: boolean, session?: ClientSession): Promise<WithId<Review>[]> {
        const matchingReviews = await this._reviewModel.find({ userId }, undefined, { session });

        const updateResulte = await this._reviewModel.updateMany({ userId }, { isHidden: hide }, { session });

        if (updateResulte.matchedCount !== matchingReviews.length) {
            throw new Error('Retreived reviews count does not match updated reviews count');
        }

        return matchingReviews as unknown as WithId<Review>[];
    }
    
    public async deleteReviewsByUserID(userId: string, session?: ClientSession) {
        const matchingReviews = await this._reviewModel.find({ userId }, undefined, { session });

        const deleteResult = await this._reviewModel.deleteMany({ userId }, { session });

        if (deleteResult.deletedCount !== matchingReviews.length) {
            throw new Error('Retreived reviews count does not match deleted reviews count');
        }

        return matchingReviews as unknown as WithId<Review>[];
    }
}
