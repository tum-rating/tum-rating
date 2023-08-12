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
    course: string;
}

export const CreateReviewRequestSchema = Joi.object<CreateReviewRequestDto>({
    courseId: Joi.string().required(),
    courseNumber: Joi.string().required(),
    professor: Joi.string().required(),
    course: Joi.string().required()
});
