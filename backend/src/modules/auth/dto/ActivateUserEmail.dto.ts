import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JWTRegex } from 'src/utils/jwt/jwt.regex';

export class ActivateUserEmailRequestDto {
    @ApiProperty()
    token: string;
}

export const ActivateUserEmailRequestSchema =
    Joi.object<ActivateUserEmailRequestDto>({
        token: Joi.string().regex(JWTRegex).required(),
    });
