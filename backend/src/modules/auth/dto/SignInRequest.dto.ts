import * as Joi from 'joi';

export interface SignInRequestDto {
    email: string,
    password: string
}

export const SignInRequestSchema = Joi.object<SignInRequestDto>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
