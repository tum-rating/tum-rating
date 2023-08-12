import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

export const SignUpRequestSchema = Joi.object<SignUpRequestDto>({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});
