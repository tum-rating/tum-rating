import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyObject, createSecretKey } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

import { JWTSignOptions, TokenType, UserRole } from './jwt.interfaces';
import { 
    ErrorJWTInvalidTokenType, 
    ErrorJWTUndefinedRole,
    ErrorJWTExpirationClaimFalied,
    JWTErrorCodes 
} from './jwt.errors';

@Injectable()
export class JWTService {
    private readonly _jwtSecret: KeyObject;
    private readonly _jwtExpirationToken: string;
    private readonly _jwtExpirationAccessToken: string;

    constructor(private readonly _configService: ConfigService) {
        const jwtSecretString = this._configService.getOrThrow('jwt.secret');
        const jwtExpirationToken = this._configService.getOrThrow('jwt.expiration_token');
        const jwtExpirationAccessToken = this._configService.getOrThrow('jwt.expiration_access');

        this._jwtSecret = createSecretKey(jwtSecretString);
        this._jwtExpirationToken = jwtExpirationToken;
        this._jwtExpirationAccessToken = jwtExpirationAccessToken;
    }

    public async signJWTAccess(userId: string, userRole = UserRole.user) {
        return this._signJWT(userId, TokenType.access, { userRole, expiration: this._jwtExpirationAccessToken });
    }

    public async verifyJWTAccess(token: string) {
        return this._verifyJWT(token, TokenType.access);
    }

    public async signJWTActivate(userId: string) {
        return this._signJWT(userId, TokenType.activation);
    }

    public async signJWTRecovery(userId: string) {
        return this._signJWT(userId, TokenType.recovery);
    }

    public async verifyJWTActivate(token: string) {
        return this._verifyJWT(token, TokenType.activation);
    }

    public async verifyJWTRecovery(token: string) {
        return this._verifyJWT(token, TokenType.recovery);
    }

    private async _signJWT(userId: string, tokenType: TokenType, options?: Partial<JWTSignOptions>) {
        const defaultJWTSignOptions: JWTSignOptions = {
            expiration: this._jwtExpirationToken,
            userRole: UserRole.user,
            ...options,
        };

        const token = await new SignJWT({
            tokenType,
            userRole: defaultJWTSignOptions.userRole,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject(userId)
            .setExpirationTime(defaultJWTSignOptions.expiration)
            .sign(this._jwtSecret);

        return token;
    }

    private async _verifyJWT(token: string, tokenType: TokenType) {
        try {
            const { payload, protectedHeader } = await jwtVerify(token, this._jwtSecret);

            if (payload.tokenType !== tokenType) return { isValid: false, payload: null, error: new ErrorJWTInvalidTokenType() };

            if (payload.userRole === undefined) return { isValid: false, payload: null, error: new ErrorJWTUndefinedRole() };

            return { isValid: true, payload };
        } catch (error) {
            if (error && error.code === JWTErrorCodes.ERR_JWT_EXPIRED) return { isValid: false, payload: null, error: new ErrorJWTExpirationClaimFalied() };

            return { isValid: false, payload: null, error: error };
        }
    }
}
