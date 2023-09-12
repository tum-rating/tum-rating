import { Injectable } from '@nestjs/common';

import { ReviewProposalRepository } from 'src/database/repositories/reviewProposal.repository';
import { ReviewProposal } from 'src/database/documents/reviewProposal';
import { ReviewRepository } from 'src/database/repositories/review.repository';
import { Review } from 'src/database/documents/Review';
import { NotFoundError } from 'src/utils/errors/errors';

@Injectable()
export class ReviewProposalService {
  constructor(
    private readonly _reviewProposalRepository: ReviewProposalRepository,
    private readonly _reviewRepository: ReviewRepository
  ) {}

  public async getAllReviewProposals() {
    return this._reviewProposalRepository.findAll();
  }

  public async getReviewProposalsById(id: string) {
    return this._reviewProposalRepository.findOneById(id);
  }

  public async createReviewProposal(review: ReviewProposal) {
    return this._reviewProposalRepository.create(review as ReviewProposal);
  }

  public async updateReviewProposal(id: string, review: Partial<ReviewProposal>) {
    return this._reviewProposalRepository.updateOneById(id, review);
  }

  public async acceptReviewProposalAddingItToReviews(id: string) {
    const reviewProposal = await this.getReviewProposalsById(id);

    if(reviewProposal === null) throw new NotFoundError('review proposal not found');

    const reviewToCreate = {
      course: reviewProposal.course,
      courseId: reviewProposal.courseId,
      courseNumber: reviewProposal.courseNumber,
      professor: reviewProposal.professor,
      otherLecturers: reviewProposal.otherLecturers,
      offeredInSemesters: reviewProposal.offeredInSemesters
    } as unknown as Review;

    Reflect.deleteProperty(reviewToCreate, '_id');
    delete reviewToCreate['__v'];

    console.log('acceptReviewProposalAddingItToReviews review to be created: ', reviewToCreate);

    return this._reviewRepository.create(reviewToCreate);
  }

  public async deleteReviewProposal(id: string) {
    return this._reviewProposalRepository.deleteOneById(id);
  }
}
