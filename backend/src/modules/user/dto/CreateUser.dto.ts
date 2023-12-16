import * as Joi from 'joi';

export interface CreateUserDto {
    email: string;
    username: string;
    passwordHash: string;
    passwordSalt: string;
}
