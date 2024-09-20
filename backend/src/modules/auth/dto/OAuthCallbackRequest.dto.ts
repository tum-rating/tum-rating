import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JWTRegex } from 'src/utils/jwt/jwt.regex';

export class OAuthCallbackRequestDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    redirectURL: string;
}

export const OAuthCallbackRequestSchema = Joi.object<OAuthCallbackRequestDto>({
    // code: Joi.string().required(),
    // state: Joi.string(),
    redirectURL: Joi.string().required(),
});
