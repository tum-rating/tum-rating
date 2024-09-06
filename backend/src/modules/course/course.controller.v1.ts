import {
    Controller,
    UseGuards,
    Delete,
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
import { AuthGuard } from 'src/common/guards/auth.guard';
import { OptionalIntPipeAtLeast1 } from 'src/common/pipes/OptionalIntAtLeast1.pipe';
import { MongoIdPipe } from 'src/common/pipes/MongoId.pipe';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/database/documents/user';
import { Review } from 'src/database/documents/review';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { CourseReviewSemesterMismatch, DuplicateError, NotFoundError } from 'src/utils/errors/errors';
import { getNextPageNumber, PaginatedResults } from 'src/utils/api/pagination';

import { CourseService } from './course.service';
import { AddReviewRequestDto, AddReviewRequestSchema } from './dto/AddReviewRequest.dto';
import { PatchReviewRequestDto, PatchReviewRequestSchema } from './dto/PatchReviewRequest.dto';
import { GetCourseWithReviewsResponseDto, GetCourseWithoutReviewResponseDto } from './dto/GetCourseRequest.dto';

@ApiTags('courses')
@Controller('/api/v1/courses')
export class CourseControllerV1 {
    constructor(
        private readonly _courseService: CourseService,
        private readonly _userService: UserService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(CourseControllerV1.name);
    }

    @Get()
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
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
    public async getCourses(
        @Query('page-number', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1))
        pageNumber: number = 1,
        @Query('page-size', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1))
        pageSize: number = 100,
        @Query('search') search?: string,
    ) {
        this._logger.info('Get courses requested with pageNumber %s, pageSize %d and search %s', pageNumber, pageSize, search);

        const results = await this._courseService.getCoursesOverviewPaginated(pageNumber, pageSize, search);

        this._logger.info('Successfuly retrieved courses with count %d', results.length);

        return new PaginatedResults(
            results.map(course => new GetCourseWithoutReviewResponseDto(course)),
            getNextPageNumber(results, pageNumber, pageSize),
        );
    }

    @ApiQuery({
        name: 'page-number',
        required: false,
        type: Number,
        description: 'Does not work for now, just to be pagination compliant.'
    })
    @ApiQuery({
        name: 'page-size',
        required: false,
        type: Number,
    })
    @Get('/trending')
    public async getTrendingCourses(
        @Query('page-number', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1))
        pageNumber: number = 1,
        @Query('page-size', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1))
        pageSize: number = 20,
    ) {
        this._logger.info('Get trending courses requested');

        const validatedPageSize = pageSize < 100 ? pageSize : 100;

        const trendingCourses = await this._courseService.getTrendingCourses(validatedPageSize);

        this._logger.info('Successfuly retrieved trending courses with count %d', trendingCourses.length);

        return new PaginatedResults(
            trendingCourses.map(trendingCourse => new GetCourseWithoutReviewResponseDto(trendingCourse)),
            null
        );
    }

    @Get('/:id')
    public async getCourseById(@Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) id: string) {
        this._logger.info('Get course with id: %s', id);

        try {
            const courseWithReviews = await this._courseService.getCourseByIdWihtPopulatedReviews(id);
    
            this._logger.info('Successfuly retrieved course with id: %s', courseWithReviews.id);
    
            return new GetCourseWithReviewsResponseDto(courseWithReviews);
        } catch (error) {
            if (error instanceof NotFoundError) {
                this._logger.debug('Course not found with id: %s', id);
                throw new NotFoundException(error.message);
            }

            this._logger.error('Failed to get course with id: %s', id, error);
            throw error;
        }
    }

    @Get('/:courseId/user/me')
    @UseGuards(AuthGuard)
    public async getReview(
        @Headers(USER_ID) userId: string,
        @Param('courseId', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string
    ) {
        this._logger.info('Get review %s user %s', courseId, userId);

        try {
            const review = await this._courseService.getReview(courseId, userId);

            this._logger.info('Successfuly retrieved with id: %s', review.id);

            return review;
        } catch (error) {
            if (error instanceof NotFoundError) {
                this._logger.debug('Review %s user %s not found', courseId, userId);
                throw new NotFoundException(error.message);
            }

            this._logger.error('Failed to get course %s user %s: ', courseId, userId, error);
            throw error;
        }
    }

    @ApiBearerAuth()
    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @Post('/:course_id/user/:user_id')
    @UseGuards(AuthGuard)
    public async addReview(
        @Headers(USER_ID) userId: string,
        @Param('user_id', new JoiObjectSchemaPipe(MongoIdPipe)) queryUserId: string,
        @Param('course_id', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string,
        @Body(new JoiObjectSchemaPipe(AddReviewRequestSchema))
        body: AddReviewRequestDto,
    ) {
        this._logger.info('Add review user: %s to course %s', userId, courseId);

        if (userId != queryUserId) {
            this._logger.warn('User id from jwt does not match one in query param');
            throw new ForbiddenException();
        }

        let user: WithId<User>;

        try {
            user = await this._userService.getUser(userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(error.message);
            }

            this._logger.error('Get me request failed for user %s', userId);
            throw error;
        }

        const review = {
            ...body,
            userId: userId as unknown as ObjectId,
            userName: user.username,
            courseId: courseId as unknown as ObjectId,
        };

        let createdReview: WithId<Review>;
        try {
            createdReview = await this._courseService.addReview(review);
        } catch (error: any) {
            if (error instanceof DuplicateError) {
                if (error.isConflictingKey('userId') && error.isConflictingKey('courseId')) {
                    this._logger.debug('User %s has already submitted a review for %s', userId, courseId);
                    throw new ConflictException('User has already submitted a review, use patch method to update');
                }
            }

            if (error instanceof CourseReviewSemesterMismatch) {
                this._logger.debug('Add review error, semester mismatch course %s, semester %s', courseId, body.semester);

                throw new BadRequestException(error.message);
            }

            this._logger.error('User add review error', error);
            throw new InternalServerErrorException();
        }

        await this._courseService.updateCourseStats(courseId);

        this._logger.info('Successfully added review user: %s to review: %s', userId, courseId);

        return {
            createdReviewUser: createdReview,
        };
    }

    @ApiBearerAuth()
    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @Patch('/:course_id/user/:user_id')
    @UseGuards(AuthGuard)
    public async patchUserReview(
        @Headers(USER_ID) userId: string,
        @Param('user_id', new JoiObjectSchemaPipe(MongoIdPipe)) queryUserId: string,
        @Param('course_id', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string,
        @Body(new JoiObjectSchemaPipe(PatchReviewRequestSchema))
        body: PatchReviewRequestDto,
    ) {
        this._logger.info('Patch review user: %s to review %s', userId, courseId);

        if (userId != queryUserId) {
            this._logger.warn('User id %s from jwt does not match one in query param %s', userId, queryUserId);
            throw new ForbiddenException();
        }

        let updatedReview: any;
        try {
            updatedReview = await this._courseService.patchReview(courseId, userId, body);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                this._logger.warn('Review not found, user: %s review: %s, semester %s', userId, courseId);
                throw new NotFoundException('review not found');
            }

            if (error instanceof CourseReviewSemesterMismatch) {
                this._logger.debug('Add review user error, semester mismatch review %s, semester %s', courseId, body.semester);

                throw new BadRequestException('semester');
            }

            this._logger.error('User put review error %s', error);
            throw new InternalServerErrorException();
        }

        await this._courseService.updateCourseStats(courseId);

        this._logger.info('Successfully put review user: %s to review: %s', userId, courseId);

        return {
            updatedReview,
        };
    }
}
