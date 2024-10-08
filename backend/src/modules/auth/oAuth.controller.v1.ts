import {
    BadGatewayException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotImplementedException,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { UserService } from 'src/modules/user/user.service';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { GetUserPublicResponseDto } from 'src/modules/user/dto/GetUserPublicResponse.dto';
import { BadOAuthGatewayException, InvalidGrantError } from 'src/utils/errors/oAuthErrors';

import { OAuthService, ValidateAuthorizationCodeResponse } from './oAuth.service';
import { OAuthCallbackRequestDto, OAuthCallbackRequestSchema } from './dto/OAuthCallbackRequest.dto';
import { SignInResponseDto } from './dto/SignInResponse.dto';

@ApiTags('auth')
@Controller('api/v1/auth/oauth')
export class OAuthControllerV1 {
    constructor(
        private readonly _logger: PinoLogger,
        private readonly _userService: UserService,
        private readonly _jwtService: JWTService,
        private readonly _mailerService: MailerService,
        private readonly _oAuthService: OAuthService,
        private readonly _configService: ConfigService,
    ) {
        this._logger.setContext(OAuthControllerV1.name);
    }

   @Get()
   public async getAuthorizationURL(
    @Res() res: Response,
   ) {
        this._logger.info('Getting authorization URL request');

        const redirectURL = await this._oAuthService.getAuthorizationURL();

        this._logger.info('Redirecting to authorization URL %s', redirectURL);

        return res.redirect(redirectURL);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    public async callback(
        @Body(new JoiObjectSchemaPipe(OAuthCallbackRequestSchema))
        body: OAuthCallbackRequestDto,
    ): Promise<SignInResponseDto> {
        this._logger.info('Callback request %o', body);

        const isOAuthEnabled = this._configService.get<boolean>('oauth.isEnabled');

        if (!isOAuthEnabled) {
            this._logger.warn('OAuth is not enabled');

            throw new NotImplementedException();
        }

        let userData: ValidateAuthorizationCodeResponse;
        try {
            userData = await this._oAuthService.validateAuthorizationCode(body.redirectURL);
        } catch (error) {
            if (error instanceof InvalidGrantError) {
                this._logger.warn('Invalid grant error for redirect URL %s', body.redirectURL);

                throw new BadGatewayException('Invalid grant');
            }

            if (error instanceof BadOAuthGatewayException) {
                this._logger.warn('Bad OAuth gateway error for redirect URL %s', body.redirectURL);

                throw new BadGatewayException('Bad OAuth params');
            }

            throw error;
        }

        const userUpsertResults = await this._userService.upsertUser(userData);

        const user = userUpsertResults.user;

        if (!userUpsertResults.newlyCreated && user.isBanned) {
            this._logger.warn('Sign in request fail for tum id, user email is banned for %s', user.email);

            throw new UnauthorizedException('User is banned');
        }

        const token = await this._jwtService.signJWTAccess(user.id, user.role);

        if (userUpsertResults.newlyCreated) {
            this._mailerService.sendOAuthSignUpEmail({email: user.email})
                .then(() => this._logger.info('Sent email to %s', user.email))
                .catch((error) => this._logger.error('Failed to send email to %s, error: %o', user.email, error));
        }

        return new SignInResponseDto(
            new GetUserPublicResponseDto(
                user.id,
                user.email,
                user.username,
                user.role,
            ),
            token,
        ); 
    }
}
