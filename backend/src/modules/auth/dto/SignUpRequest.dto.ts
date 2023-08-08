import * as Joi from 'joi';

export interface SignUpRequestDto {
    email: string,
    username: string,
    password: string
}

export const SignUpRequestSchema = Joi.object<SignUpRequestDto>({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});
