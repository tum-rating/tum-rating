import * as Joi from 'joi';

export const OptionalIntPipe = Joi.number().integer().min(0);