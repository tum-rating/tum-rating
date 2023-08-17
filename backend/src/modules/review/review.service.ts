import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review, UserReview } from 'src/database/documents/review';
import { ReviewuserUniqueRepository } from 'src/database/repositories/reviewUserUnique';
import { AddReviewError } from 'src/utils/errors/errors';

@Injectable()
export class ReviewService {
  constructor(
    private readonly _reviewRepository: ReviewRepository,
    private readonly _reviewUserUniqueRepository: ReviewuserUniqueRepository,
  ) {}

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
    userReview: Pick<
      UserReview,
      'userId' | 'howEasyRating' | 'howInterestingRating' | 'comment'
    >,
    reviewId: string,
  ) {
    // aggregate might be a better approach here but possibly slower
    await this._reviewUserUniqueRepository.create({
      userId: userReview.userId,
      reviewId: reviewId as unknown as ObjectId,
    });

    try {
      await this._reviewRepository.addUserReview(userReview, reviewId);
    } catch (error) {
      throw new AddReviewError(error);
    }
  }

  public async deleteReviewUserUnique(userId: string, reviewId: string) {
    return this._reviewUserUniqueRepository.deleteOneByUserIdAndReviewId(
      userId,
      reviewId,
    );
  }

  public async updateReviewStats(reviewId: string) {
    return this._reviewRepository.updateReviewStats(reviewId);
  }

  public async updateReview(id: string, review: Partial<Review>) {
    return this._reviewRepository.updateOneById(id, review);
  }

  public async deleteReview(id: string) {
    return this._reviewRepository.deleteOneById(id);
  }
}
