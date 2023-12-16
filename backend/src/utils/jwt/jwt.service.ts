import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, jwtVerify } from 'jose';

import { JWTSignOptions, TokenType, UserRole } from './jwt.interfaces';

@Injectable()
export class JWTService {
    private readonly _jwtSecret: Uint8Array;

    constructor(private readonly _configService: ConfigService) {
        const jwtSecretString = this._configService.getOrThrow('jwt.secret');
        this._jwtSecret = new TextEncoder().encode(jwtSecretString);
    }

    public async signJWTAccess(userId: string, userRole = UserRole.user) {
        return this._signJWT(userId, TokenType.access, { userRole });
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

    private async _signJWT(
        userId: string,
        tokenType: TokenType,
        options?: Partial<JWTSignOptions>,
    ) {
        const defaultJWTSignOptions: JWTSignOptions = {
            expiration: '1d',
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
            const { payload, protectedHeader } = await jwtVerify(
                token,
                this._jwtSecret,
            );

            if (payload.tokenType !== tokenType)
                return { isValid: false, payload: null };

            if (payload.userRole === undefined)
                return { isValid: false, payload: null };

            return { isValid: true, payload };
        } catch (error) {
            return { isValid: false, payload: null };
        }
    }
}
