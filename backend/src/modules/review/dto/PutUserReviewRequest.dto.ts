import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class PatchUserReviewRequestDto {
    @ApiProperty()
    howInterestingRating?: number;
  
    @ApiProperty()
    howEasyRating?: number;
  
    @ApiProperty()
    comment?: string;
  
    @ApiProperty()
    semester?: string;
  }

export const PatchUserReviewRequestSchema = Joi.object<PatchUserReviewRequestDto>({
howInterestingRating: Joi.number().min(0).max(5).precision(2),
howEasyRating: Joi.number().min(0).max(5).precision(2),
comment: Joi.string(),
semester: Joi.string(),
});
