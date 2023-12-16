import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewRequestDto {
    @ApiProperty()
    courseId: string;

    @ApiProperty()
    courseNumber: string;

    @ApiProperty()
    professor: string;

    @ApiProperty()
    otherLecturers?: string[];

    @ApiProperty()
    course: string;

    @ApiProperty()
    offeredInSemesters: string[];
}

export const CreateReviewRequestSchema = Joi.object<CreateReviewRequestDto>({
    courseId: Joi.string().required(),
    courseNumber: Joi.string().required(),
    professor: Joi.string().required(),
    otherLecturers: Joi.array().items(Joi.string()),
    course: Joi.string().required(),
    offeredInSemesters: Joi.array().items(Joi.string()).min(1).required(),
});
