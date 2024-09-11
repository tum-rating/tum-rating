import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

import { Review } from 'src/database/documents/review';

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