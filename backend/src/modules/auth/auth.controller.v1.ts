import {
    Body,
    Controller,
    Post,
    HttpStatus,
    UnauthorizedException,
    HttpCode
} from '@nestjs/common';
import {
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, Injectable } from '@nestjs/common';
import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { UserService } from 'src/modules/user/user.service';
import { JWTService } from 'src/utils/jwt/jwt.service';
// import { LoggerInterface, LoggerService } from 'src/utils/logger/logger.service';
// import { MailerService } from 'src/modules/mailer/mailer.service';

import { AuthService } from './auth.service';

import { SignUpRequestDto, SignUpRequestSchema } from './dto/SignUpRequest.dto';
import { SignInRequestDto, SignInRequestSchema } from './dto/SignInRequest.dto';
import { SignInResponseDto } from './dto/SignInResponse.dto';
// import { ActivateEmailRequestDto, ActivateEmailRequestSchema } from './dto/ActivateEmailRequest.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthControllerV1 {
    // private readonly _logger: LoggerInterface
    // private readonly _webappBaseUrl: string;

    constructor (
        // private readonly _loggerService: LoggerService,
        private readonly _logger: Logger,
        private readonly _userService: UserService,
        private readonly _authenticationService: AuthService,
        private readonly _jwtService: JWTService,
        // private readonly _mailerService: MailerService,
        private readonly _configService: ConfigService,
    ) {
        // this._logger = this._loggerService.getLoggerWithLabel(AuthenticationControllerV1.name);
        // this._webappBaseUrl = this._configService.get('webapp.url')
        this._logger = new Logger(AuthControllerV1.name);
    }

    @Post('/signup')
    public async signUpLocal(@Body() body: SignUpRequestDto) {
        this._logger.log('Signup request received with user email %o', body.email);

        const passwordSalt = await this._authenticationService.getSalt();

        const passwordHash = await this._authenticationService.getHash(body.password, passwordSalt);

        try {
            const createdUser = await this._userService.createUser({
                email: body.email,
                username: body.username,
                passwordHash,
                passwordSalt
            });

            // this._logger.debug('Preparing activation token for email: %s', body.email);

            // const activationToken = await this._jwtService.signJWTActivate(createdUserId);

            // const activationLink = `${this._webappBaseUrl}/auth/activate?token=${activationToken}`;

            // TODO dodaj html templatke na to
            // await this._mailerService.send(
            //     [{
            //         email: body.email
            //     }],
            //     'Activation token',
            //     `Activate your account with link: ${activationLink}`
            // );

            this._logger.log(
                'Signup local request completed user created with email %s, id %s', 
                body.email,
                createdUser
            );
        }
        catch(error) {
            this._logger.error('Signup local error: %o', error);

            // if(error.code === PostgresErrorCodes.uniqueViolation) {
            //     // TODO handle it
            // }

            throw error;
        }
    }

    // @Post('/activate')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @UsePipes(new JoiObjectSchemaPipe(ActivateEmailRequestSchema))
    // public async activateEmail(@Body() body: ActivateEmailRequestDto) {
    //     const {isValid, payload} = await this._jwtService.verifyJWTActivate(body.token);

    //     if(!isValid)
    //         throw new UnauthorizedException();
        
    //     this._logger.info('Activate email request received for user %o', payload.sub);

    //     await this._userService.activateEmailForUserId(payload.sub);

    //     this._logger.info('Activate email request completed for user %s', payload.sub);
    // }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: 200,
        type: SignInResponseDto
    })
    public async signin(@Body(new JoiObjectSchemaPipe(SignInRequestSchema)) body: SignInRequestDto): Promise<SignInResponseDto> {
      
        this._logger.log('Signin request received for user with email %s', body.email);

        const databaseUser = await this._userService.getUserByEmail(body.email);

        if(!databaseUser /*|| !databaseUser.isEmailConfirmed*/) {
            this._logger.warn('Sign in request fail, user does not exsit or email is not confirmed for %s', body.email);
            throw new UnauthorizedException();
        }

        const passwordHash = await this._authenticationService.getHash(body.password, databaseUser.passwordSalt);

        if(passwordHash !== databaseUser.passwordHash) {
            this._logger.warn('Sign in request fail, password does not match for %s', body.email);
            throw new UnauthorizedException();
        }

        const token = await this._jwtService.signJWTAccess(databaseUser.id);

        this._logger.log('Signin request completed user with email %s', body.email);

        return {
            user: {
                id: databaseUser.id,
                email: databaseUser.email,
                username: databaseUser.username
            },
            token
        };
    }
}