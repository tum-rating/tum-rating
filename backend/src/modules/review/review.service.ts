import { Injectable } from '@nestjs/common';

import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review, ReviewSchema, UserReview } from 'src/database/documents/review';
import { ReviewuserUniqueRepository } from 'src/database/repositories/reviewUserUnique';

import { ObjectId } from 'mongoose';

@Injectable()
export class ReviewService {
    constructor (
        private readonly _reviewRepository: ReviewRepository,
        private readonly _reviewUserUniqueRepository: ReviewuserUniqueRepository
    ) {
    }

    public async createReview(review: Partial<Review>) {

        return this._reviewRepository.create(review as Review);
    }

    public async getReviewsOverview() {
        const review = await this._reviewRepository.findAllOverview();

        return review;
    }

    public async getReviewById(id: string) {
        const review = await this._reviewRepository.findOneById(id);

        return review;
    }

    public async addUserReview(
        userReview: Pick<UserReview, 'userId' | 'howEasyRating' | 'howInterestingRating' | 'comment'>,
        reviewId: string
    ) {
        console.log('addUserReview service', userReview, 'reviewId: ', reviewId);

        await this._reviewUserUniqueRepository.create({
            userId: userReview.userId,
            reviewId: reviewId as unknown as ObjectId,
        });

        const result  = await this._reviewRepository.addUserReview(userReview, reviewId);
        return result;
    }

    public async updateReview(id: string, review: Partial<Review>) {
        return this._reviewRepository.updateOneById(id, review);
    }

    public async deleteReview(id: string) {
        return this._reviewRepository.deleteOneById(id);
    }
}