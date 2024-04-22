import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

const createCourseProposalRegex = /^https:\/\/campus\.tum\.de.*courses\/.*/;

export class CreateCourseProposalRequestDto {
    @ApiProperty()
    url: string;
}

export const CreateCourseProposalRequestSchema = Joi.object<CreateCourseProposalRequestDto>({
    url: Joi.string().regex(createCourseProposalRegex).required(),
});

export class CreateCourseProposalResponseDto {
    @ApiProperty()
    id: string;
}