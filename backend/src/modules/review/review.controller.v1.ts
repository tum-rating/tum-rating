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
  NotFoundException,
  ForbiddenException,
  Put,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { OptionalIntPipeAtLeast1 } from 'src/common/pipes/OptionalIntAtLeast1.pipe';

import { ReviewService } from './review.service';
import {
  CreateReviewRequestDto,
  CreateReviewRequestSchema,
} from './dto/CreateReviewRequest.dto';
import {
  AddUserReviewRequestDto,
  AddUserReviewRequestSchema,
} from './dto/AddUserReviewRequest.dto';
import {
  PutUserReviewRequestDto,
  PutUserReviewRequestSchema
} from './dto/PutUserReviewRequest.dto'
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { ERROR_MONGO_DUPLICATE_CODE } from 'src/utils/errors/mongoErrorCodes';
import { AddUserReviewError, AddUserReviewNotFoundError, NotFoundError } from 'src/utils/errors/errors';

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
    name: 'page-number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page-size',
    required: false,
    type: Number,
  })
  public async getReviews(
    @Query('page-number', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1)) pageNumber: number = 1,
    @Query('page-size', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1)) pageSize: number = 100, 
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
  @ApiParam({
    name: 'user-id',
    required: false,
    description:
        '(Leave empty. It will be extracted from JWT token)',
  })
  @Post()
  @UseGuards(AdminGuard) //TODO align test with admin guard
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

  @ApiBearerAuth()
  @ApiBearerAuth()
  @ApiParam({
    name: 'user-id',
    required: false,
    description:
        '(Leave empty. It will be extracted from JWT token)',
  })
  @Post('/:review_id/user/:user_id')
  @UseGuards(AuthGuard)
  public async addUserReview(
    @Headers(USER_ID) userId: string,
    @Param('user_id') queryUserId: string,
    @Param('review_id') reviewId: string,
    @Body(new JoiObjectSchemaPipe(AddUserReviewRequestSchema))
    body: AddUserReviewRequestDto,
  ) {
    this._logger.info('Add review user: %s to review %s', userId, reviewId);

    if (userId != queryUserId) {
      this._logger.warn('User id from jwt does not match one in query param');
      throw new ForbiddenException();
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
          'User has already submitted a review, use put method to update',
        );
      }

      if (error instanceof AddUserReviewNotFoundError) {
        this._logger.warn(
          'Review not found, reverting unique user review, user: %s review: %s',
          userId,
          reviewId,
        );
        await this._reviewService.deleteReviewUserUnique(userId, reviewId);
        throw new NotFoundException('review not found');
      }

      if (error instanceof AddUserReviewError) {
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

  @ApiBearerAuth()
  @ApiBearerAuth()
  @ApiParam({
    name: 'user-id',
    required: false,
    description:
        '(Leave empty. It will be extracted from JWT token)',
  })
  @Put('/:review_id/user/:user_id')
  @UseGuards(AuthGuard)
  public async putUserReview(
    @Headers(USER_ID) userId: string,
    @Param('user_id') queryUserId: string,
    @Param('review_id') reviewId: string,
    @Body(new JoiObjectSchemaPipe(PutUserReviewRequestSchema))
    body: PutUserReviewRequestDto,
  ) {
    this._logger.info('Patch review user: %s to review %s', userId, reviewId);

    if (userId != queryUserId) {
      this._logger.warn('User id from jwt does not match one in query param');
      throw new ForbiddenException();
    }

    const reviewUserUnique = await this._reviewService.findReviewUserUnique(userId, reviewId);

    if(!reviewUserUnique) {
      this._logger.debug('Relation user %s review %s unique does not exist', userId, reviewId);
      throw new NotFoundException();
    }

    const userReview = {
      ...body,
      userId: userId as unknown as ObjectId,
    };

    try {
      await this._reviewService.putUserReview(reviewId, userId, userReview);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        this._logger.warn(
          'Review not found, user: %s review: %s, semester %s',
          userId,
          reviewId,
          userReview.semester
        );
        throw new NotFoundException('review not found');
      }

      this._logger.error('User put review error %s', error);
      throw new InternalServerErrorException();
    }

    this._reviewService
      .updateReviewStats(reviewId)
      .then(() => this._logger.debug('Review stats updated for %s', reviewId))
      .catch(() =>
        this._logger.warn('Review stats update failed for %s', reviewId),
      );

    this._logger.info(
      'Successfully put review user: %s to review: %s',
      userId,
      reviewId,
    );

    return {
      userReview,
    };
  }
}
