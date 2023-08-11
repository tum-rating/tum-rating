import * as Joi from 'joi';

export interface AddUserReviewRequestDto {
    howInterestingRating: number,
    howEasyRating: number,
    comment: string,
}

export const AddUserReviewRequestSchema = Joi.object<AddUserReviewRequestDto>({
    howInterestingRating: Joi.number().required().min(0).max(100),
    howEasyRating:  Joi.number().required().min(0).max(100),
    comment: Joi.string()
});
