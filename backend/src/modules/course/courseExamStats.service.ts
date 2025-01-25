import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { CourseRepository } from 'src/database/repositories/course.repository';
import { ExamGrade, ExamStats } from 'src/database/documents/examStats';
import { NotFoundError, CourseExamStatsSemesterMismatch } from 'src/utils/errors/errors';
import { calculateExamStats } from 'src/utils/exam-stats/calculateExamStats';

import { ExamType } from './dto/PatchCourseExamStatsRequest.dto';

@Injectable()
export class CourseExamStatsService {
    constructor(
        private readonly _courseRepository: CourseRepository,
        private readonly _logger: PinoLogger,
    ) {
        this._logger.setContext(CourseExamStatsService.name);
    }

    public async patchExamStats(courseId: string, semester: string, examType: ExamType, examGrades: Pick<ExamStats, 'grades'>): Promise<ExamStats> {
        const course = await this._courseRepository.findOneById(courseId);

        if (course === null) throw new NotFoundError('course not found');

        if (!course.offeredInSemesters.includes(semester)) throw new CourseExamStatsSemesterMismatch(semester, course.offeredInSemesters);

        const examStats = calculateExamStats(examGrades);

        await this._courseRepository.patchCourseExamStats(courseId, semester, examType, examStats);

        return examStats;
    }
}
