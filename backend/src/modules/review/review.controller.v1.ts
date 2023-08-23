import {
  Controller,
  UseGuards,
  Get,
  Post,
  Headers,
  Body,
  Param,
  ConflictException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { OptionalIntPipe } from 'src/common/pipes/OptionalInt.pipe';

import { ReviewService } from './review.service';
import {
  CreateReviewRequestDto,
  CreateReviewRequestSchema,
} from './dto/CreateReviewRequest.dto';
import {
  AddUserReviewRequestDto,
  AddUserReviewRequestSchema,
} from './dto/AddUserReviewRequest.dto';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { ERROR_MONGO_DUPLICATE_CODE } from 'src/utils/errors/mongoErrorCodes';
import { AddReviewError } from 'src/utils/errors/errors';

@ApiTags('reviews')
@Controller('/api/v1/reviews')
export class ReviewControllerV1 {
  constructor(
    private readonly _reviewService: ReviewService,
    private readonly _logger: PinoLogger,
  ) {
    this._logger.setContext(ReviewControllerV1.name);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: String,
  })
  public async getReviews(
    @Query('page-number', new JoiObjectSchemaPipe(OptionalIntPipe)) pageNumber: number = 0,
    @Query('page-size', new JoiObjectSchemaPipe(OptionalIntPipe)) pageSize: number = 100,
    @Query('search') search?: string,
  ) {
    this._logger.info('Get reviews requested with pageNumber %s, pageSize %d and search %s', pageNumber, pageSize, search);

    const paginetedResults = await this._reviewService.getReviewsOverviewPaginated(pageNumber, pageSize, search);

    this._logger.info('Successfuly retrieved reviews with count %d', paginetedResults.reviews.length);

    return paginetedResults;
  }

  @Get('/:id')
  public async getReviewById(@Param('id') id: string) {
    this._logger.info('Get review with id: ', id);

    const review = await this._reviewService.getReviewById(id);

    this._logger.info('Successfuly retrieved with id: %s', review.id);

    return review;
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  public async createReview(
    @Headers(USER_ID) userId: string,
    @Body(new JoiObjectSchemaPipe(CreateReviewRequestSchema))
    body: CreateReviewRequestDto,
  ) {
    this._logger.info(
      'Create review request received for %s, %s',
      body.course,
      body.professor,
    );

    const createdReview = await this._reviewService.createReview(body);

    this._logger.info(
      'Successfuly created review for course %s, %s',
      body.course,
      body.professor,
    );

    return {
      id: createdReview.id,
    };
  }

  @ApiBearerAuth('asd')
  @Post('/:review_id/user/:user_id')
  @UseGuards(AuthGuard)
  public async addReview(
    @Headers(USER_ID) userId: string,
    @Param('user_id') queryUserId: string,
    @Param('review_id') reviewId: string,
    @Body(new JoiObjectSchemaPipe(AddUserReviewRequestSchema))
    body: AddUserReviewRequestDto,
  ) {
    this._logger.info('Add review user: %s to review %s', userId, reviewId);

    if (userId != queryUserId) {
      this._logger.warn('User id from jwt does not match one in query param');
    }

    const userReview = {
      ...body,
      userId: userId as unknown as ObjectId,
    };

    try {
      await this._reviewService.addUserReview(userReview, reviewId);
    } catch (error: any) {
      if (error.code == ERROR_MONGO_DUPLICATE_CODE) {
        this._logger.debug(
          'User %s has already submitted a review for %s',
          userId,
          reviewId,
        );
        throw new ConflictException(
          'User has already submitted a review, use patch method to update',
        );
      }

      if (error instanceof AddReviewError) {
        this._logger.warn(
          'Add review error, reverting unique user review, user: %s review: %s',
          userId,
          reviewId,
        );
        await this._reviewService.deleteReviewUserUnique(userId, reviewId);
        throw new InternalServerErrorException();
      }

      this._logger.error('User add review error', error);
      throw new InternalServerErrorException();
    }

    this._reviewService
      .updateReviewStats(reviewId)
      .then(() => this._logger.debug('Review stats updated for %s', reviewId))
      .catch(() =>
        this._logger.warn('Review stats update failed for %s', reviewId),
      );

    this._logger.info(
      'Successfully added review user: %s to review: %s',
      userId,
      reviewId,
    );

    return {
      userReview,
    };
  }
}
