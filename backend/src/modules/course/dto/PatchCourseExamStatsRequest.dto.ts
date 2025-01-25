import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

import { ExamGradeDto } from './GetCourseRequest.dto';

export enum ExamType {
    Endterm = 'endterm',
    Retake = 'retake',
}

export enum ExamGrade {
    GRADE_1_0 = 1.0,
    GRADE_1_3 = 1.3,
    GRADE_1_7 = 1.7,
    GRADE_2_0 = 2.0,
    GRADE_2_3 = 2.3,
    GRADE_2_7 = 2.7,
    GRADE_3_0 = 3.0,
    GRADE_3_3 = 3.3,
    GRADE_3_7 = 3.7,
    GRADE_4_0 = 4.0,
    GRADE_4_3 = 4.3,
    GRADE_4_7 = 4.7,
    GRADE_5_0 = 5.0,
    // student registered but did not attend to the exam
    GRADE_6_0 = 6.0,
}

export class PatchCourseExamStatsGradesDto {
    @ApiProperty()
    grade: ExamGrade;
    
    @ApiProperty()
    people: number;
}

export class PatchCourseExamStatsDto {
    @ApiProperty()
    semester: string;

    @ApiProperty()
    examType: ExamType;

    @ApiProperty()
    grades: PatchCourseExamStatsGradesDto[];
}

export const PatchCourseExamStatsRequestSchema = Joi.object<PatchCourseExamStatsDto>({
    semester: Joi.string().pattern(/^\d{4} [WS]$/).required(),
    examType: Joi.string().valid(ExamType.Endterm, ExamType.Retake).required(),
    grades: Joi.array().items(
        Joi.object({
            grade: Joi.string().valid(
                ExamGrade.GRADE_1_0,
                ExamGrade.GRADE_1_3,
                ExamGrade.GRADE_1_7,
                ExamGrade.GRADE_2_0,
                ExamGrade.GRADE_2_3,
                ExamGrade.GRADE_2_7,
                ExamGrade.GRADE_3_0,
                ExamGrade.GRADE_3_3,
                ExamGrade.GRADE_3_7,
                ExamGrade.GRADE_4_0,
                ExamGrade.GRADE_4_3,
                ExamGrade.GRADE_4_7,
                ExamGrade.GRADE_5_0,
                ExamGrade.GRADE_6_0
            ).required(),
            people: Joi.number().required(),
        })
    ).required().length(14),
});

export class PatchCourseExamStatsResponseDto {
    constructor(
        peopleTotal: number,
        attemptsTotal: number,
        peopleAttemptsFailed: number,
        attemptsFailedPercentage: number,
        averageAttemptsTotal: number,
        averageAttemptsPassed: number,
        grades: { grade: ExamGrade; people: number }[]
    ) {
        this.peopleTotal = peopleTotal;
        this.attemptsTotal = attemptsTotal;
        this.peopleAttemptsFailed = peopleAttemptsFailed;
        this.attemptsFailedPercentage = attemptsFailedPercentage;
        this.averageAttemptsTotal = averageAttemptsTotal;
        this.averageAttemptsPassed = averageAttemptsPassed;
        this.grades = grades.map(grade => new ExamGradeDto(grade.grade, grade.people));
    }

    @ApiProperty()
    peopleTotal: number;

    @ApiProperty()
    attemptsTotal: number;

    @ApiProperty()
    peopleAttemptsFailed: number;

    @ApiProperty()
    attemptsFailedPercentage: number;

    @ApiProperty()
    averageAttemptsTotal: number;

    @ApiProperty()
    averageAttemptsPassed: number;

    @ApiProperty()
    grades: ExamGradeDto[];
}