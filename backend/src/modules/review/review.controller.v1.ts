import { Controller, Logger, UseGuards, Get, Post, Headers, Body, Param, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import {
    ApiBearerAuth,
    ApiTags,
} from '@nestjs/swagger';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Review } from 'src/database/documents/Review';

import { ReviewService } from './review.service';
import { CreateReviewRequestDto, CreateReviewRequestSchema } from './dto/CreateReviewRequest.dto';
import { AddUserReviewRequestDto, AddUserReviewRequestSchema } from './dto/AddUserReviewRequest.dto';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { ERROR_MONGO_DUPLICATE_CODE } from 'src/utils/errors/mongoErrorCodes';
import { AddReviewError } from 'src/utils/errors/errors';

@ApiTags('reviews')
@Controller('/api/v1/reviews')
export class ReviewControllerV1 {
    constructor (
        private readonly _reviewService: ReviewService,
        private readonly _logger: Logger,
    ) {
        this._logger = new Logger(ReviewControllerV1.name);
    }

    @Get()
    public async getReviews() {
        this._logger.log('Get all reviews requested');

        const reviews = await this._reviewService.getReviewsOverview();

        this._logger.log('Successfuly retrieved all reviews');

        return {
           reviews: reviews
        }
    }

    @Get('/:id')
    public async getReviewById(
        @Param('id') id: string
    ) {
        this._logger.log('Get review with id: ', id);

        const review = await this._reviewService.getReviewById(id);

        this._logger.log(`Successfuly retrieved with id: ${review.id}`);

        return review
    }

    @ApiBearerAuth()
    @Post()
    @UseGuards(AuthGuard)
    public async createReview(
        @Headers(USER_ID) userId: string,
        @Body(new JoiObjectSchemaPipe(CreateReviewRequestSchema)) body: CreateReviewRequestDto 
    ) {
        this._logger.log(`Create review request received for ${body.course}, ${body.professor}`);

        const createdReview = await this._reviewService.createReview(body);

        this._logger.log(`Successfuly created review for course ${body.course}, professor ${body.professor} with id ${createdReview.id}`);

        return {
            id: createdReview.id
        }
    }

    @ApiBearerAuth('asd')
    @Post('/:review_id/user/:user_id')
    @UseGuards(AuthGuard)
    public async addReview(
        @Headers(USER_ID) userId: string,
        @Param('user_id') queryUserId: string,
        @Param('review_id') reviewId: string,
        @Body(new JoiObjectSchemaPipe(AddUserReviewRequestSchema)) body: AddUserReviewRequestDto,
    ) {
        this._logger.log(`Add review user: ${userId} to review ${reviewId}`);

        if (userId != queryUserId) {
            this._logger.warn('User id from jwt does not match one in query param')
        }

        const userReview = {
            ...body,
            userId: (userId as unknown as ObjectId)
        }

        try {
            await this._reviewService.addUserReview(userReview, reviewId);
        } catch(error: any) {
            if(error.code == ERROR_MONGO_DUPLICATE_CODE) {
                this._logger.debug(`User ${userId} has already submitted a review for ${reviewId}`)
                throw new ConflictException('User has already submitted a review, use patch method to update');
            }

            if(error instanceof AddReviewError) {
                this._logger.warn(`Add review error, reverting unique user review, user: ${userId} review: ${reviewId}`)
                await this._reviewService.deleteReviewUserUnique(userId, reviewId);
                throw new InternalServerErrorException();
            }
            
            this._logger.error(`User add review error ${error}`);
            throw new InternalServerErrorException();
        }

        this._reviewService.updateReviewStats(reviewId)
            .then(() => this._logger.debug(`Review stats updated for ${reviewId}`))
            .catch(() => this._logger.warn(`Review stats update failed for ${reviewId}`));

        this._logger.log(`Successfully added review user: ${userId} to review: ${reviewId}`);

        return {
            userReview
        }
    }
}