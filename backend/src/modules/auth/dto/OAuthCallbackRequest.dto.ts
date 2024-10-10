import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JWTRegex } from 'src/utils/jwt/jwt.regex';

export class OAuthCallbackRequestDto {
    @ApiProperty()
    redirectURL: string;
}

export const OAuthCallbackRequestSchema = Joi.object<OAuthCallbackRequestDto>({
    redirectURL: Joi.string().required(),
});
