import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseWithoutReviews } from 'src/database/documents/course';
import { CourseWithReviews } from 'src/database/repositories/course.repository';
import { GetReviewResponseDto } from 'src/modules/review/dto/GetReviewRequest.dto';

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