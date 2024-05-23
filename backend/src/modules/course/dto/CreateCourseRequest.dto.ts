import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { GetCourseResponseDto } from './GetCourseRequest.dto';

export class CreateCourseRequestDto {
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
}

export const CreateCourseRequestSchema = Joi.object<CreateCourseRequestDto>({
    courseId: Joi.string().required(),
    courseNumber: Joi.string().required(),
    professor: Joi.string().required(),
    otherLecturers: Joi.array().items(Joi.string()),
    name: Joi.string().required(),
    offeredInSemesters: Joi.array().items(Joi.string()).min(1).required(),
});

export { GetCourseResponseDto as CreateCourseResponseDto };