import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class AddReviewRequestDto {
    @ApiProperty()
    howInterestingRating: number;

    @ApiProperty()
    howEasyRating: number;

    @ApiProperty()
    comment?: string;

    @ApiProperty()
    semester: string;
}

export const AddReviewRequestSchema = Joi.object<AddReviewRequestDto>({
    howInterestingRating: Joi.number().required().min(0).max(5).precision(2),
    howEasyRating: Joi.number().required().min(0).max(5).precision(2),
    comment: Joi.string().max(2000),
    semester: Joi.string().required(),
});
