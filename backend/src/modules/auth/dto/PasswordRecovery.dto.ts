import { ApiPropertyOptional } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JWTRegex } from 'src/utils/jwt/jwt.regex';

export class PasswordRecoveryRequestDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  token?: string;

  @ApiPropertyOptional()
  password?: string;
}

export const PasswordRecoveryRequestSchema =
  Joi.object<PasswordRecoveryRequestDto>({
    token: Joi.string().regex(JWTRegex),
    email: Joi.string().email(),
    password: Joi.string(),
  })
    .or('token', 'email')
    .and('token', 'password');
