import * as Joi from 'joi';

export interface CreateReviewRequestDto {
    professor: string,
    course: string
}

export const CreateReviewRequestSchema = Joi.object<CreateReviewRequestDto>({
    professor: Joi.string().required(),
    course: Joi.string().required()
});
