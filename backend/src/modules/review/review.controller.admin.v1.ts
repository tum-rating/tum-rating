import { Controller, UseGuards, Get, Query, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { AdminGuard } from 'src/common/guards/admin.guard';
import { OptionalIntPipeAtLeast1 } from 'src/common/pipes/OptionalIntAtLeast1.pipe';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { MongoIdPipeOptional } from 'src/common/pipes/MongoId.pipe';
import { getNextPageNumber, PaginatedResults } from 'src/utils/api/pagination';

import { ReviewService } from './review.service';
import { GetReviewResponseDto } from './dto/GetReviewRequest.dto';

@ApiTags('reviews')
@UseGuards(AdminGuard)
@Controller('/api/v1/reviews')
export class ReviewAdminControllerV1 {
    constructor(
        private readonly _reviewService: ReviewService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(ReviewAdminControllerV1.name);
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    public async getCourseProposalById(
        @Query('page-number', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1))
        pageNumber: number = 1,
        @Query('page-size', new JoiObjectSchemaPipe(OptionalIntPipeAtLeast1))
        pageSize: number = 100,
        @Query('user-id', new JoiObjectSchemaPipe(MongoIdPipeOptional))
        userId?: string,
        @Query('course-id', new JoiObjectSchemaPipe(MongoIdPipeOptional))
        courseId?: string,
    ): Promise<PaginatedResults<GetReviewResponseDto>> {
        this._logger.info(
            'Get reviews requested with page number: %d and page size: %d, course id %s, user id %s',
            pageNumber,
            pageSize,
            courseId,
            userId,
        );

        const results = await this._reviewService.getPaginatedReviews(
            { pageNumber, pageSize },
            { userId, courseId },
        );

        this._logger.info('Successfully retrieved %d reviews', results.length);

        return new PaginatedResults(
            results.map((review) => new GetReviewResponseDto(review)),
            getNextPageNumber(results, pageSize, pageNumber),
        );
    }

}
