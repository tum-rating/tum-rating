import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Course, CourseWithoutReviews } from 'src/database/documents/course';
import { Review } from 'src/database/documents/review';
import { CourseWithReviews } from 'src/database/repositories/course.repository';

export class GetReviewResponseDto {
    constructor(review: WithId<Review>) {
        this.id = review.id;
        this.userId = review.userId;
        this.userName = review.userName;
        this.courseId = review.courseId;
        this.howInterestingRating = review.howInterestingRating;
        this.howEasyRating = review.howEasyRating;
        this.comment = review.comment;
        this.semester = review.semester;
        this.createdAt = review.createdAt;
        this.updatedAt = review.updatedAt;
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: ObjectId;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    courseId: ObjectId;

    @ApiProperty()
    howInterestingRating: number;
    
    @ApiProperty()
    howEasyRating: number;

    @ApiProperty()
    comment?: string;

    @ApiProperty()
    semester: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
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