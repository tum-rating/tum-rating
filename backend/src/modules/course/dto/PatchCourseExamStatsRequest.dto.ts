import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

import { ExamGradeDto } from './GetCourseRequest.dto';

export enum ExamType {
    Endterm = 'endterm',
    Retake = 'retake',
}

export enum ExamGrade {
    GRADE_HIGHEST = 1.0,
    GRADE_MINIMAL_PASSING = 4.0,
    GRADE_LOWEST = 5.0,
    // student registered but did not attend to the exam
    GRADE_NOT_ATTEMPTED = 6.0,
}

export class PatchCourseExamStatsGradesDto {
    @ApiProperty()
    grade: number;
    
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
            grade: Joi.number()
                .custom((value, helpers) => {
                    if (
                        (value >= ExamGrade.GRADE_HIGHEST && value <= ExamGrade.GRADE_LOWEST) ||
                        value === ExamGrade.GRADE_NOT_ATTEMPTED
                    ) {
                        return value;
                    }
                    return helpers.error(`grade ${value} is not a valid grade`);
                })
                .required(),
            people: Joi.number().required(),
        })
    ).required().min(1),
});

export class PatchCourseExamStatsResponseDto {
    constructor(
        peopleTotal: number,
        attemptsTotal: number,
        peopleAttemptsFailed: number,
        attemptsFailedPercentage: number,
        averageAttemptsTotal: number,
        averageAttemptsPassed: number,
        grades: { grade: number; people: number }[]
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