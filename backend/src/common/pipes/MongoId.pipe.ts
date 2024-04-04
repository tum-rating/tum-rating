import * as Joi from 'joi';

export const MongoIdPipe = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();
