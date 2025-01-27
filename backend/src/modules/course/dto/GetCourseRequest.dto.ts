import { ApiProperty } from '@nestjs/swagger';
import { ExamGrade, ExamStats } from 'src/database/documents/examStats';
import { Course, CourseWithoutReviews } from 'src/database/documents/course';
import { CourseWithReviews } from 'src/database/repositories/course.repository';
import { GetReviewResponseDto } from 'src/modules/review/dto/GetReviewRequest.dto';

export class ExamGradeDto {
    constructor(
        examGrade: ExamGrade,
        people: number,
    ) {
        this.grade = Number(examGrade).toFixed(1).toString();
        this.people = people;
    }

    @ApiProperty()
    grade: string;

    @ApiProperty()
    people: number;
}

export class ExamStatsResponseDto {
    constructor(examStats: ExamStats) {
        this.peopleTotal = examStats.peopleTotal;
        this.attemptsTotal = examStats.attemptsTotal;
        this.peopleAttemptsFailed = examStats.peopleAttemptsFailed;
        this.attemptsFailedPercentage = examStats.attemptsFailedPercentage;
        this.averageAttemptsTotal = examStats.averageAttemptsTotal;
        this.averageAttemptsPassed = examStats.averageAttemptsPassed;
        this.grades = examStats.grades.map(grade => new ExamGradeDto(grade.grade, grade.people));
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

export class GetCourseResponseDto {
    constructor(course: WithId<Course>) {
        this.id = course.id;
        this.courseId = course.courseId;
        this.courseNumber = course.courseNumber;
        this.professor = course.professor;
        this.otherLecturers = course.otherLecturers;
        this.name = course.name;
        this.offeredInSemesters = course.offeredInSemesters;
        this.howInterestingRatingAverage = course.howInterestingRatingAverage;
        this.howEasyRatingAverage = course.howEasyRatingAverage;
        this.votesNumber = course.votesNumber;
        this.examStats = performCourseExamStatsMapping(course.examStats); 
        this.reviews = course.reviews;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    courseId: string;

    @ApiProperty()
    courseNumber: string;

    @ApiProperty()
    professor: string;

    @ApiProperty()
    otherLecturers?: string[];

    @ApiProperty()
    name: string;

    @ApiProperty()
    offeredInSemesters: string[];

    @ApiProperty()
    howInterestingRatingAverage: number;

    @ApiProperty()
    howEasyRatingAverage: number;

    @ApiProperty()
    votesNumber: number;

    @ApiProperty()
    examStats: { [key: string]: { [key: string]: ExamStatsResponseDto } };

    @ApiProperty()
    reviews: string[];
}

export class GetCourseWithReviewsResponseDto {
    constructor(course: WithId<CourseWithReviews>) {
        this.id = course.id;
        this.courseId = course.courseId;
        this.courseNumber = course.courseNumber;
        this.professor = course.professor;
        this.otherLecturers = course.otherLecturers;
        this.name = course.name;
        this.offeredInSemesters = course.offeredInSemesters;
        this.howInterestingRatingAverage = course.howInterestingRatingAverage;
        this.howEasyRatingAverage = course.howEasyRatingAverage;
        this.votesNumber = course.votesNumber;
        this.examStats = performCourseExamStatsMapping(course.examStats);
        this.reviews = course.reviews.map(review => new GetReviewResponseDto(review));
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    courseId: string;

    @ApiProperty()
    courseNumber: string;

    @ApiProperty()
    professor: string;

    @ApiProperty()
    otherLecturers?: string[];

    @ApiProperty()
    name: string;

    @ApiProperty()
    offeredInSemesters: string[];

    @ApiProperty()
    howInterestingRatingAverage: number;

    @ApiProperty()
    howEasyRatingAverage: number;

    @ApiProperty()
    votesNumber: number;

    @ApiProperty()
    examStats: { [key: string]: { [key: string]: ExamStatsResponseDto } };

    @ApiProperty()
    reviews: GetReviewResponseDto[];
}

export class GetCourseWithoutReviewResponseDto {
    constructor(course: WithId<CourseWithReviews> | WithId<CourseWithoutReviews>) {
        this.id  = course.id;
        this.courseId = course.courseId;
        this.courseNumber = course.courseNumber;
        this.professor = course.professor;
        this.otherLecturers = course.otherLecturers;
        this.name = course.name;
        this.offeredInSemesters = course.offeredInSemesters;
        this.howInterestingRatingAverage = course.howInterestingRatingAverage;
        this.howEasyRatingAverage = course.howEasyRatingAverage;
        this.votesNumber = course.votesNumber;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    courseId: string;

    @ApiProperty()
    courseNumber: string;

    @ApiProperty()
    professor: string;

    @ApiProperty()
    otherLecturers?: string[];

    @ApiProperty()
    name: string;

    @ApiProperty()
    offeredInSemesters: string[];

    @ApiProperty()
    howInterestingRatingAverage: number;

    @ApiProperty()
    howEasyRatingAverage: number;

    @ApiProperty()
    votesNumber: number;
}

const performCourseExamStatsMapping = (courseExamStats: Map<string, Map<string, ExamStats>>) => {
    if (!courseExamStats) return null;

    const newObject = Object.fromEntries(
        Array.from(courseExamStats.entries()).map(([key, value]) => [
            key,
            Object.fromEntries(
                Array.from(value.entries()).map(([innerKey, innerValue]) => [
                    innerKey,
                    new ExamStatsResponseDto(innerValue),
                ])
            ),
        ])
    );

    return newObject;
}