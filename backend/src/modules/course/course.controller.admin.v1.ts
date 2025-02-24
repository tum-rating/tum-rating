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
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';

import { USER_ID } from 'src/utils/headers/context.headers';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { MongoIdPipe } from 'src/common/pipes/MongoId.pipe';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { DuplicateError, NotFoundError, CourseExamStatsSemesterMismatch } from 'src/utils/errors/errors';

import { CourseService } from './course.service';
import { CourseExamStatsService } from './courseExamStats.service';

import { CreateCourseRequestDto, CreateCourseRequestSchema, CreateCourseResponseDto } from './dto/CreateCourseRequest.dto';
import { PatchCourseRequestDto, PatchCourseRequestSchema, PatchCourseResponseDto } from './dto/PatchCourseRequest.dto';
import { DeleteCourseResponseDto } from './dto/DeleteCourseRequest.dto';
import { GetCourseWithoutReviewResponseDto } from './dto/GetCourseRequest.dto';
import { PatchCourseExamStatsDto, PatchCourseExamStatsRequestSchema, PatchCourseExamStatsResponseDto } from './dto/PatchCourseExamStatsRequest.dto';

@ApiTags('courses')
@UseGuards(AdminGuard)
@Controller('/api/v1/courses')
export class CourseControllerAdminV1 {
    constructor(
        private readonly _courseService: CourseService,
        private readonly _courseExamStatsService: CourseExamStatsService,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(CourseControllerAdminV1.name);
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @Post()
    public async createCourse(
        @Headers(USER_ID) adminId: string,
        @Body(new JoiObjectSchemaPipe(CreateCourseRequestSchema))
        body: CreateCourseRequestDto,
    ): Promise<CreateCourseResponseDto> {
        this._logger.info('Create course request received for course: %s, professor: %s, by admin: %s', body.name, body.professor, adminId);

        try {
            const createdCourse = await this._courseService.createCourse(body);
    
            this._logger.info('Successfuly created course for course %s, %s', body.name, body.professor);
    
            return new CreateCourseResponseDto(createdCourse);
        } catch(error) {
            if (error instanceof DuplicateError) {
                if (error.isConflictingKey('name') && error.isConflictingKey('professor')) {
                    this._logger.debug('Course already exists with name %s and professor %s, by admin %s', body.name, body.professor, adminId);
                    throw new ConflictException('Course already exists');
                }
            }

            throw error;
        }
    }

    @ApiBearerAuth()
    @Post('/trending')
    public async resetTrendingCoursesCache() {
        this._logger.info('Reset trending courses cache requested');

        const trendingCourses = await this._courseService.resetTrendingCoursesCache();

        this._logger.info('Successfuly reset trending courses');

        return trendingCourses.map(trendingCourse => new GetCourseWithoutReviewResponseDto(trendingCourse));
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @ApiOkResponse({
        status: 200,
        type: PatchCourseResponseDto,
    })
    @Patch('/:course_id')
    public async patchCourse(
        @Headers(USER_ID) userId: string,
        @Param('course_id', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string,
        @Body(new JoiObjectSchemaPipe(PatchCourseRequestSchema)) body: PatchCourseRequestDto,
    ): Promise<PatchCourseResponseDto> {
        this._logger.info('Patch course request received for course: %s, by admin: %s', courseId, userId);

        try {
            const createdCourse = await this._courseService.updateCourse(courseId, body);

            this._logger.info('Successfuly patched course for course %s, by admin %s', courseId, userId);

            return new PatchCourseResponseDto(createdCourse);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                this._logger.debug('Course not found with id %s', courseId);
                throw new NotFoundException(error.message);
            }

            this._logger.error('Failed to patch course for course %s, by admin %s: ', courseId, userId, error);
            throw error;
        }
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @ApiOkResponse({
        status: 200,
        type: PatchCourseResponseDto,
    })
    @Patch('/:course_id/align-stats')
    public async alignCourseStats(
        @Headers(USER_ID) adminId: string,
        @Param('course_id', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string,
        @Body(new JoiObjectSchemaPipe(PatchCourseRequestSchema)) body: PatchCourseRequestDto,
    ): Promise<PatchCourseResponseDto> {
        this._logger.info('Align course stats request received for course: %s, by admin: %s', courseId, adminId);

        try {
            const alignedCourse = await this._courseService.updateCourseStats(courseId);

            this._logger.info('Successfuly aligned course stats for course %s, by admin %s', courseId, adminId);

            return new PatchCourseResponseDto(alignedCourse);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                this._logger.debug('Course not found with id %s', courseId);
                throw new NotFoundException(error.message);
            }

            this._logger.error('Failed to aligned course stats for course %s, by admin %s: ', courseId, adminId, error);
            throw error;
        }
    }

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @ApiOkResponse({
        status: 200,
        type: DeleteCourseResponseDto,
    })
    @Delete('/:course_id')
    public async deleteCourse(
        @Headers(USER_ID) userId: string,
        @Param('course_id', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string,
        @Body(new JoiObjectSchemaPipe(PatchCourseRequestSchema)) body: PatchCourseRequestDto,
    ): Promise<DeleteCourseResponseDto> {
        this._logger.info('Delete course request received for course: %s, by admin: %s', courseId, userId);

        try {
            const createdCourse = await this._courseService.deleteCourse(courseId);

            this._logger.info('Successfuly deleted course for course %s, by admin %s', courseId, userId);

            return new DeleteCourseResponseDto(createdCourse);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                this._logger.debug('Course not found with id %s', courseId);
                throw new NotFoundException(error.message);
            }

            this._logger.error('Failed to delete course for course %s, by admin %s: ', courseId, userId, error);
            throw error;
        }
    }

    // course exam stats

    @ApiBearerAuth()
    @ApiParam({
        name: 'user-id',
        required: false,
        description: '(Leave empty. It will be extracted from JWT token)',
    })
    @ApiOkResponse({
        status: 204,
        type: PatchCourseExamStatsResponseDto,
    })
    @Patch('/:course_id/exam-stats')
    public async patchCourseExamStats(
        @Headers(USER_ID) userId: string,
        @Param('course_id', new JoiObjectSchemaPipe(MongoIdPipe)) courseId: string,
        @Body(new JoiObjectSchemaPipe(PatchCourseExamStatsRequestSchema)) body: PatchCourseExamStatsDto,
    ): Promise<PatchCourseExamStatsResponseDto> {
        this._logger.info('Patch course exam stats request received for course: %s, by admin: %s', courseId, userId);

        try {
            const updatedExamStats = await this._courseExamStatsService.patchExamStats(courseId, body.semester, body.examType, body);

            this._logger.info('Successfuly patched course exam stats for course %s, by admin %s', courseId, userId);

            return new PatchCourseExamStatsResponseDto(
                updatedExamStats.peopleTotal,
                updatedExamStats.attemptsTotal,
                updatedExamStats.peopleAttemptsFailed,
                updatedExamStats.attemptsFailedPercentage,
                updatedExamStats.averageAttemptsTotal,
                updatedExamStats.averageAttemptsPassed,
                updatedExamStats.grades,
            );
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                this._logger.debug('Course not found with id %s', courseId);
                throw new NotFoundException(error.message);
            }
            if (error instanceof CourseExamStatsSemesterMismatch) {
                this._logger.debug('Course exam stats semester mismatch for course %s', courseId);
                throw new BadRequestException(error.message);
            }

            this._logger.error('Failed to patch course exam stats for course %s, by admin %s: ', courseId, userId, error);
            throw error;
        }
    }

    // end course exam stats
}
