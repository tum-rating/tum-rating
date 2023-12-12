import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review } from 'src/database/documents/review';
import { ReviewUser } from 'src/database/documents/reviewUser';
import { BadRequestError, NotFoundError, UserReviewSemesterMismatch } from 'src/utils/errors/errors';
import { CreateReviewUserType, PatchReviewUserType, ReviewUserRepository } from 'src/database/repositories/reviewUser.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly _reviewRepository: ReviewRepository,
    private readonly _reviewUserRepository: ReviewUserRepository,
  ) {}

  public async createReview(review: Partial<Review>) {
    return this._reviewRepository.create(review as Review);
  }

  public async getReviewsOverviewPaginated(pageNumber: number, pageSize: number, search?: string) {
    const results = await this._reviewRepository.getReviewsByQuery(pageNumber, pageSize, search);

    return {
      reviews: results,
      nextPageNumber: results.length > 0 ? pageNumber + 1 : null,
    };
  }

  public async getReviewById(id: string) {
    const review = await this._reviewRepository.findOneById(id);

    return review;
  }

  public async getReviewByIdWihtPopulatedReviewsUser(id: string) {
    const review = await this._reviewRepository.findOneByIdWithPopulatedReviews(id);

    return review;
  }

  public async getReviewUser(reviewId: string, userId: string) {
    const reviewUser = await this._reviewUserRepository.getOneByReviewIdAndUserId(reviewId, userId);

    if(reviewUser === null)
      throw new NotFoundError(`review ${reviewId} user ${userId} not found`);

    return reviewUser;
  }

  public async addReviewUser(
    reviewUser: CreateReviewUserType,
  ) {
    const review = await this.getReviewById(reviewUser.reviewId as unknown as string);

    if(!review.offeredInSemesters.includes(reviewUser.semester))
      throw new UserReviewSemesterMismatch(reviewUser.semester);

    const createdReviewUser = await this._reviewUserRepository.create(reviewUser);

    await this._reviewRepository.addReviewUser(review.id, createdReviewUser.id);

    return createdReviewUser;
  }

  public async deleteReviewUser(userId: string, reviewId: string) {
    return this._reviewUserRepository.deleteOneByUserIdAndReviewId(
      userId,
      reviewId,
    );
  }

  public async updateReviewStats(reviewId: string) {
    const stats = await this._reviewUserRepository.getStatsByReviewId(reviewId);

    return this._reviewRepository.updateReviewStats(reviewId, stats);
  }

  public async updateReview(id: string, review: Partial<Review>) {
    return this._reviewRepository.updateOneById(id, review);
  }

  public async patchReviewUser(reviewId: string, userId: string, patchUserReview: PatchReviewUserType) {
    const review = await this._reviewRepository.findOneById(reviewId);

    if(review === null) 
      throw new NotFoundError('review not found');

    if(patchUserReview.semester && !review.offeredInSemesters.includes(patchUserReview.semester))
      throw new UserReviewSemesterMismatch(patchUserReview.semester);

    const updateResult = await this._reviewUserRepository.updateOneByUserIdAndReviewId(userId, reviewId, patchUserReview);

    if(updateResult === null) 
      throw new NotFoundError('user review not found');

    return updateResult;
  }

  public async deleteReview(id: string) {
    return this._reviewRepository.deleteOneById(id);
  }
}
