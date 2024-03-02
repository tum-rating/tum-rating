import * as Joi from 'joi';

export const OptionalIntPipeAtLeast1 = Joi.number().integer().min(1);
