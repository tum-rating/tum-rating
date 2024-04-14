import { Controller, UseGuards, Get, Post, Headers, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { MongoIdPipe } from 'src/common/pipes/MongoId.pipe';

import { CourseProposalService } from './courseProposal.service';
import { CreateCourseProposalRequestDto, CreateCourseProposalRequestSchema } from './dto/CreateCourseProposalRequest.dto';

@ApiTags('review-proposals')
@Controller('/api/v1/review-proposals')
export class CourseProposalControllerV1 {
    constructor(
        private readonly _courseProposalService: CourseProposalService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(CourseProposalControllerV1.name);
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get()
    public async getCourseProposals() {
        this._logger.info('Get course proposal requested');

        const courseProposals = await this._courseProposalService.getAllCourseProposals();

        this._logger.info('Successfuly retrieved all course proposal with count %d', courseProposals.length);

        return courseProposals;
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Get('/:id')
    public async getCourseProposalById(@Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) id: string) {
        this._logger.info('Get course proposal with with id: %s', id);

        const courseProposal = await this._courseProposalService.getCourseProposalsById(id);

        if (courseProposal === null) throw new NotFoundException();

        this._logger.info('Successfuly retrieved course proposal with id: %s', courseProposal.id);

        return courseProposal;
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @UseGuards(AuthGuard)
    @Post()
    public async createCourseProposal(
        @Headers(USER_ID) userId: ObjectId,
        @Body(new JoiObjectSchemaPipe(CreateCourseProposalRequestSchema))
        body: CreateCourseProposalRequestDto,
    ) {
        this._logger.info('Create course proposal request received for %s, %s, by user %s', body.name, body.professor, userId);

        const createdCourseProposal = await this._courseProposalService.createCourseProposal({
            ...body,
            userId,
        });

        this._logger.info('Successfuly created course proposal for course %s, %s', body.name, body.professor);

        return {
            id: createdCourseProposal.id,
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
    public async acceptCourseProposal(@Headers(USER_ID) userId: ObjectId, @Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) id: string) {
        this._logger.info('Accept course proposal with id %s requested by user %s', id, userId);

        const createdCourse = await this._courseProposalService.acceptCourseProposalAddingItToCourses(id);

        this._logger.info('Successfuly accepted course proposal with id %s, created review with id %s', id, createdCourse.id);

        await this._courseProposalService.deleteCourseProposal(id);

        this._logger.info('Successfuly deleted course proposal %s, after acceptance', id);

        return {
            createdReview: createdCourse.id,
        };
    }

    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @Delete('/:id')
    public async deleteCourseProposal(@Param('id', new JoiObjectSchemaPipe(MongoIdPipe)) id: string) {
        this._logger.info('Delete course proposal with with id: %s', id);

        const courseProposal = await this._courseProposalService.deleteCourseProposal(id);

        this._logger.info('Successfuly deleted course proposal with id: %s', courseProposal.id);

        return courseProposal;
    }
}
