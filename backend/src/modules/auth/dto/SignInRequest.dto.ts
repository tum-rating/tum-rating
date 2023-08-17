import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export const SignInRequestSchema = Joi.object<SignInRequestDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
