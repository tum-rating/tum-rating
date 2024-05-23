import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

import { GetCourseResponseDto } from './GetCourseRequest.dto';

export class PatchCourseRequestDto {
    @ApiProperty()
    courseId?: string;

    @ApiProperty()
    courseNumber?: string;

    @ApiProperty()
    professor?: string;

    @ApiProperty()
    otherLecturers?: string[];

    @ApiProperty()
    name?: string;

    @ApiProperty()
    offeredInSemesters?: string[];
}

export const PatchCourseRequestSchema = Joi.object<PatchCourseRequestDto>({
    courseId: Joi.string(),
    courseNumber: Joi.string(),
    professor: Joi.string(),
    otherLecturers: Joi.array().items(Joi.string()),
    name: Joi.string(),
    offeredInSemesters: Joi.array().items(Joi.string()).min(1),
});

export { GetCourseResponseDto as PatchCourseResponseDto };