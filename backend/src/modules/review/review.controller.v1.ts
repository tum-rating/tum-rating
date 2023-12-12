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
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { OptionalIntPipeAtLeast1 } from 'src/common/pipes/OptionalIntAtLeast1.pipe';
import { UserService } from 'src/modules/user/user.service';

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
  PatchUserReviewRequestDto,
  PatchUserReviewRequestSchema
} from './dto/PutUserReviewRequest.dto'
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { ERROR_MONGO_DUPLICATE_CODE } from 'src/utils/errors/mongoErrorCodes';
import { BadRequestError, AddUserReviewError, AddUserReviewNotFoundError, UserReviewSemesterMismatch, NotFoundError } from 'src/utils/errors/errors';

@ApiTags('reviews')
@Controller('/api/v1/reviews')
export class ReviewControllerV1 {
  constructor(
    private readonly _reviewService: ReviewService,
    private readonly _userService: UserService,
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
    this._logger.info('Get review with id: %s', id);

    const review = await this._reviewService.getReviewByIdWihtPopulatedReviewsUser(id);

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
  @UseGuards(AdminGuard) 
  public async createReview(
    @Headers(USER_ID) userId: string,
    @Body(new JoiObjectSchemaPipe(CreateReviewRequestSchema))
    body: CreateReviewRequestDto,
  ) {
    this._logger.info(
      'Create review request received for course: %s, professor: %s',
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
  public async addReviewUser(
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

    const user = await this._userService.getUser(userId);

    if(!user) {
      this._logger.warn('User %s does not exist', userId);
      throw new NotFoundException();
    }

    const reviewUser = {
      ...body,
      userId: userId as unknown as ObjectId,
      userName: user.username,
      reviewId: reviewId as unknown as ObjectId
    };

    console.log("add review user:", reviewUser);

    let createdReviewUser: any;
    try {
      createdReviewUser = await this._reviewService.addReviewUser(reviewUser);
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

        throw new NotFoundException('review not found');
      }

      if (error instanceof AddUserReviewError) {
        this._logger.warn(
          'Add review error, reverting unique user review, user: %s review: %s',
          userId,
          reviewId,
        );

        throw new InternalServerErrorException();
      }

      if (error instanceof UserReviewSemesterMismatch){
        this._logger.debug(
          'Add review user error, semester mismatch review %s, semester %s',
          reviewId,
          body.semester
        );

        throw new BadRequestException('semester');
      }

      this._logger.error('User add review error', error);
      throw new InternalServerErrorException();
    }

    const response = await this._reviewService.updateReviewStats(reviewId);

    console.log('response: ', response);

    this._logger.info(
      'Successfully added review user: %s to review: %s',
      userId,
      reviewId,
    );

    return {
      createdReviewUser
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
  @Patch('/:review_id/user/:user_id')
  @UseGuards(AuthGuard)
  public async patchUserReview(
    @Headers(USER_ID) userId: string,
    @Param('user_id') queryUserId: string,
    @Param('review_id') reviewId: string,
    @Body(new JoiObjectSchemaPipe(PatchUserReviewRequestSchema))
    body: PatchUserReviewRequestDto,
  ) {
    this._logger.info('Patch review user: %s to review %s', userId, reviewId);

    let updatedReview: any;
    try {
      updatedReview = await this._reviewService.patchReviewUser(reviewId, userId, body);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        this._logger.warn(
          'Review not found, user: %s review: %s, semester %s',
          userId,
          reviewId,
        );
        throw new NotFoundException('review not found');
      }

      if (error instanceof UserReviewSemesterMismatch){
        this._logger.debug(
          'Add review user error, semester mismatch review %s, semester %s',
          reviewId,
          body.semester
        );

        throw new BadRequestException('semester');
      }

      this._logger.error('User put review error %s', error);
      throw new InternalServerErrorException();
    }

    console.log('resposne', updatedReview);

    await this._reviewService.updateReviewStats(reviewId);

    this._logger.info(
      'Successfully put review user: %s to review: %s',
      userId,
      reviewId,
    );

    return {
      updatedReview,
    };
  }
}
