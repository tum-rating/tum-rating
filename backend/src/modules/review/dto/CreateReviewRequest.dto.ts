import * as Joi from 'joi';

export interface CreateReviewRequestDto {
    courseId: string;
    courseNumber: string;
    professor: string;
    course: string
}

export const CreateReviewRequestSchema = Joi.object<CreateReviewRequestDto>({
    courseId: Joi.string().required(),
    courseNumber: Joi.string().required(),
    professor: Joi.string().required(),
    course: Joi.string().required()
});
