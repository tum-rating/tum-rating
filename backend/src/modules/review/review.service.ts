import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review, UserReview } from 'src/database/documents/review';
import { ReviewuserUniqueRepository } from 'src/database/repositories/reviewUserUnique';
import { AddUserReviewError, AddUserReviewNotFoundError, NotFoundError } from 'src/utils/errors/errors';

@Injectable()
export class ReviewService {
  constructor(
    private readonly _reviewRepository: ReviewRepository,
    private readonly _reviewUserUniqueRepository: ReviewuserUniqueRepository,
  ) {}

  public async createReview(review: Partial<Review>) {
    return this._reviewRepository.create(review as Review);
  }

  public async getReviewsOverviewPaginated(pageNumber: number, pageSize: number, search?: string) {
    const results = await this._reviewRepository.getReviewsByQuery(pageNumber, pageSize, search);

    return {
      reviews: results,
      nextPageNumber: pageNumber + 1,
    };
  }

  public async getReviewById(id: string) {
    const review = await this._reviewRepository.findOneById(id);

    return review;
  }

  public async addUserReview(
    userReview: Pick<
      UserReview,
      'userId' | 'howEasyRating' | 'howInterestingRating' | 'comment' | 'semester'
    >,
    reviewId: string,
  ) {
    // aggregate might be a better approach here but possibly slower
    await this._reviewUserUniqueRepository.create({
      userId: userReview.userId,
      reviewId: reviewId as unknown as ObjectId,
    });

    try {
      const result = await this._reviewRepository.addUserReview(userReview, reviewId);
      if(!result) {
        throw new AddUserReviewNotFoundError('review not found');
      }
    } catch (error) {
      if (error instanceof AddUserReviewNotFoundError) {
        throw error;
      }
      throw new AddUserReviewError(error);
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

  public async putUserReview(reviewId: string, userId: string, putUserReview: Omit<UserReview, 'createdAt'>) {
    const updateResult = await this._reviewRepository.putUserReview(userId, reviewId, putUserReview as UserReview);

    if(updateResult === null) throw new NotFoundError('user review not found');

    return updateResult;
  }

  public async deleteReview(id: string) {
    return this._reviewRepository.deleteOneById(id);
  }

  public async findReviewUserUnique(userId: string, reviewId: string) {
    return this._reviewUserUniqueRepository.getOneByUserIdAndReviewId(userId, reviewId);
  }
}
