import {
  Body,
  Controller,
  Post,
  HttpStatus,
  UnauthorizedException,
  HttpCode,
  ConflictException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { JoiObjectSchemaPipe } from 'src/common/pipes/JoiObjectSchema.pipe';
import { UserService } from 'src/modules/user/user.service';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { ERROR_MONGO_DUPLICATE_CODE } from 'src/utils/errors/mongoErrorCodes';

import { AuthService } from './auth.service';
import { SignUpRequestDto, SignUpRequestSchema } from './dto/SignUpRequest.dto';
import { SignInRequestDto, SignInRequestSchema } from './dto/SignInRequest.dto';
import { SignInResponseDto } from './dto/SignInResponse.dto';
import { ActivateUserEmailRequestDto, ActivateUserEmailRequestSchema } from './dto/ActivateUserEmail.dto';
import { PasswordRecoveryRequestDto, PasswordRecoveryRequestSchema } from './dto/PasswordRecovery.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthControllerV1 {
  // private readonly _logger: LoggerInterface
  // private readonly _webappBaseUrl: string;

  constructor (
      // private readonly _loggerService: LoggerService,
      private readonly _logger: PinoLogger,
      private readonly _userService: UserService,
      private readonly _authenticationService: AuthService,
      private readonly _jwtService: JWTService,
      private readonly _mailerService: MailerService,
      private readonly _configService: ConfigService,
  ) {
      // this._logger = this._loggerService.getLoggerWithLabel(AuthenticationControllerV1.name);
      this._logger.setContext(AuthControllerV1.name);
  }

  @Post('/signup')
  public async signUp(@Body(new JoiObjectSchemaPipe(SignUpRequestSchema)) body: SignUpRequestDto) {
      this._logger.info('Signup request received with user email %o', body.email);

      const acceptedEmailDomains = this._configService.getOrThrow<string[]>('signup.acceptedEmailDomains');
      if(!acceptedEmailDomains.includes(body.email.split('@')[1]))
          throw new BadRequestException(`Email domain must be of ${acceptedEmailDomains}`);

      const passwordSalt = await this._authenticationService.getSalt();

      const passwordHash = await this._authenticationService.getHash(body.password, passwordSalt);

      try {
          const createdUser = await this._userService.createUser({
              email: body.email,
              username: body.username,
              passwordHash,
              passwordSalt
          });

          this._logger.debug('Preparing activation token for email: %s', body.email);

          const activationToken = await this._jwtService.signJWTActivate(createdUser.id);

          const response = await this._mailerService.sendEmailActivationEmail(
              [{email: body.email, name: body.username}],
              activationToken
          )

          this._logger.info(
              'Signup local request completed user created with email %s, id %s', 
              body.email,
              createdUser.id
          );
      }
      catch(error) {
          this._logger.error('Signup local error: %o', error);
          if(error.code == ERROR_MONGO_DUPLICATE_CODE) {
              let errorMessage;
              if(Object.keys(error.keyPattern).includes('email'))
                  errorMessage = 'Email already exists';
              else if(Object.keys(error.keyPattern).includes('username'))
                  errorMessage = 'Username already exists';

              this._logger.info('Signup duplicate "%s" already exists %s, %s', errorMessage, body.username, body.email);
              throw new ConflictException(errorMessage);
          }
          
          throw error;
      }
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
      status: 200,
      type: SignInResponseDto
  })
  public async signin(@Body(new JoiObjectSchemaPipe(SignInRequestSchema)) body: SignInRequestDto): Promise<SignInResponseDto> {
    
      this._logger.info('Signin request received for user with email %s', body.email);

      const databaseUser = await this._userService.getUserByEmail(body.email);


      if(!databaseUser) {
          this._logger.warn('Sign in request fail, user email is not activated for %s', body.email);
          throw new UnauthorizedException();
      }

      if(!databaseUser.isEmailActivated) {
          this._logger.warn('Sign in request fail, user does not exsit for %s', body.email);
          const activationToken = await this._jwtService.signJWTActivate(databaseUser.id);

          await this._mailerService.sendEmailActivationEmail(
              [{email: databaseUser.email, name: databaseUser.username}],
              activationToken
          );

          // dont reveal email confirmation with specific message
          throw new UnauthorizedException();
      }

      const passwordHash = await this._authenticationService.getHash(body.password, databaseUser.passwordSalt);

      if(passwordHash !== databaseUser.passwordHash) {
          this._logger.warn('Sign in request fail, password does not match for %s', body.email);
          throw new UnauthorizedException();
      }

      const token = await this._jwtService.signJWTAccess(databaseUser.id);

      this._logger.info('Signin request completed user with email %s', body.email);

      return {
          user: {
              id: databaseUser.id,
              email: databaseUser.email,
              username: databaseUser.username
          },
          token
      };
  }

  @Post('/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
      status: 204,
  })
  public async activateEmail(@Body(new JoiObjectSchemaPipe(ActivateUserEmailRequestSchema)) body: ActivateUserEmailRequestDto) {
      const {isValid, payload} = await this._jwtService.verifyJWTActivate(body.token);

      if(!isValid)
          throw new UnauthorizedException();
      
      this._logger.info('Activate email request received for user %o', payload.sub);

      await this._userService.activateEmail(payload.sub);

      this._logger.info('Activate email request completed for user %s', payload.sub);
  }

  @Post('/recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
      status: 204,
  })
  public async passwordRecovery(@Body(new JoiObjectSchemaPipe(PasswordRecoveryRequestSchema)) body: PasswordRecoveryRequestDto) {
      if(body.email) {
          this._logger.info('Password recovery request for email %s', body.email);

          const user = await this._userService.getUserByEmail(body.email);

          if(!user) {
              this._logger.warn('Email reqested for recovery is not in codebase %s', body.email);
              return;
          }

          const recoveryTokoen = await this._jwtService.signJWTRecovery(user.id);

          await this._mailerService.sendPasswordRecoveryEmail([{email: user.email, name: user.username}], recoveryTokoen);
          this._logger.info('Succesfully send recovery email to %s', user.email);
          return;
      }
      
      if(body.token && body.password) {
          const {isValid, payload} = await this._jwtService.verifyJWTRecovery(body.token);

          if(!isValid)
              throw new UnauthorizedException();

          this._logger.info('Password recovery request for user %s', payload.sub);

          const passwordSalt = await this._authenticationService.getSalt();

          const passwordHash = await this._authenticationService.getHash(body.password, passwordSalt);

          await this._userService.updatePassword(payload.sub, passwordHash, passwordSalt);
          
          this._logger.info('Succesfully updated password for user %s', payload.sub);
          return;
      }

      this._logger.error('Password recover invalid body after pipe validation body: %o', body);
      throw new InternalServerErrorException();
  }
}