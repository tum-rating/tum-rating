import {
    Controller,
    UseGuards,
    Get,
    Post,
    Headers,
    Body,
    Param,
    Delete,
    NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';

import { ReviewProposalService } from './reviewProposal.service';
import {
    CreateReviewProposalRequestDto,
    CreateReviewProposalRequestSchema,
} from './dto/CreateReviewProposalRequest.dto';

@ApiTags('review-proposals')
@Controller('/api/v1/review-proposals')
export class ReviewProposalControllerV1 {
    constructor(
        private readonly _reviewProposalService: ReviewProposalService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(ReviewProposalControllerV1.name);
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    public async getReviewProposals() {
        this._logger.info('Get reviews proposal requested');

        const reviewProposals =
            await this._reviewProposalService.getAllReviewProposals();

        this._logger.info(
            'Successfuly retrieved all review proposal with count %d',
            reviewProposals.length,
        );

        return reviewProposals;
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    public async getReviewProposalById(@Param('id') id: string) {
        this._logger.info('Get review proposal with with id: %s', id);

        const review =
            await this._reviewProposalService.getReviewProposalsById(id);

        if (review === null) throw new NotFoundException();

        this._logger.info(
            'Successfuly retrieved reveiw proposal with id: %s',
            review.id,
        );

        return review;
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @UseGuards(AuthGuard)
    @Post()
    public async createReviewProposal(
        @Headers(USER_ID) userId: ObjectId,
        @Body(new JoiObjectSchemaPipe(CreateReviewProposalRequestSchema))
        body: CreateReviewProposalRequestDto,
    ) {
        this._logger.info(
            'Create review proposal request received for %s, %s, by user %s',
            body.course,
            body.professor,
            userId,
        );

        const createdReview =
            await this._reviewProposalService.createReviewProposal({
                ...body,
                userId,
            });

        this._logger.info(
            'Successfuly created review proposal for course %s, %s',
            body.course,
            body.professor,
        );

        return {
            id: createdReview.id,
        };
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @UseGuards(AdminGuard)
    @Post('/:id/accept')
    public async acceptReviewProposal(
        @Headers(USER_ID) userId: ObjectId,
        @Param('id') id: string,
    ) {
        this._logger.info(
            'Accept review proposal with id %s requested by user %s',
            id,
            userId,
        );

        const createdReview =
            await this._reviewProposalService.acceptReviewProposalAddingItToReviews(
                id,
            );

        this._logger.info(
            'Successfuly accepted review proposal with id %s, created review with id %s',
            id,
            createdReview._id,
        );

        await this._reviewProposalService.deleteReviewProposal(id);

        this._logger.info(
            'Successfuly deleted review proposal %s, after acceptance',
            id,
        );

        return {
            createdReview: createdReview._id,
        };
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/:id')
    public async deleteReviewProposal(@Param('id') id: string) {
        this._logger.info('Delete review proposal with with id: %s', id);

        const review =
            await this._reviewProposalService.deleteReviewProposal(id);

        this._logger.info(
            'Successfuly deleted review proposal with id: %s',
            review.id,
        );

        return review;
    }
}
