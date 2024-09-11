import * as Joi from 'joi';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const MongoIdPipe = Joi.string().regex(mongoIdRegex).required();
export const MongoIdPipeOptional = Joi.string().regex(mongoIdRegex).optional();
