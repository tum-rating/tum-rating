import { ApiProperty } from '@nestjs/swagger';

import { Course } from 'src/database/documents/course';

export class GetTUMCourse {
    constructor(statusCode: number, course: Partial<Course> | null, error: any | null) {
        this.statusCode = statusCode;
        this.course = course;
        this.error = error;
        delete this.error?.stack;
        delete this.error?.config;
    }

    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    course: Partial<Course> | null;

    @ApiProperty()
    error: any | null;
}
