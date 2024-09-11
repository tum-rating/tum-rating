import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { CourseRepository } from 'src/database/repositories/course.repository';
import { Course } from 'src/database/documents/course';
import { NotFoundError, CourseReviewSemesterMismatch } from 'src/utils/errors/errors';
import { CreateReviewType, PatchReviewType, ReviewRepository } from 'src/database/repositories/review.repository';
import { CacheService } from 'src/utils/cache/cache.service';
import { PaginationOptions } from 'src/utils/api/pagination';
import { ReviewQueryOptions } from 'src/database/repositories/review.repository';

@Injectable()
export class ReviewService {
    constructor(
        private readonly _reviewRepository: ReviewRepository,
        private readonly _logger: PinoLogger,
    ) {}

  public async getPaginatedReviews(paginationOptions: PaginationOptions, queryOptions?: ReviewQueryOptions) {
    return this._reviewRepository.getPaginatedReviews(paginationOptions, queryOptions);
  }
}
