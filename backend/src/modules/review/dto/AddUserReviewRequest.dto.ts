import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserReviewRequestDto {
  @ApiProperty()
  howInterestingRating: number;

  @ApiProperty()
  howEasyRating: number;

  @ApiProperty()
  comment?: string;

  @ApiProperty()
  semester: string;
}

export const AddUserReviewRequestSchema = Joi.object<AddUserReviewRequestDto>({
  howInterestingRating: Joi.number().required().min(0).max(5).precision(2),
  howEasyRating: Joi.number().required().min(0).max(5).precision(2),
  comment: Joi.string(),
  semester: Joi.string().required(),
});
