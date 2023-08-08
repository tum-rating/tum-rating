import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

import { TokenType } from './jwt.interfaces';

@Injectable()
export class JWTService {
    private readonly _jwtSecret: Uint8Array;

    constructor (
        private readonly _configService: ConfigService,
    ) {
        const jwtSecretString = this._configService.getOrThrow('jwt.secret');
        this._jwtSecret = new TextEncoder().encode(jwtSecretString);
    }

    public async signJWTAccess(userId: string) {
        return this._signJWT(userId, TokenType.access, '1d');
    }

    public async verifyJWTAccess(token: string) {
        return this._verifyJWT(token, TokenType.access);
    }

    public async signJWTActivate(userId: string) {
        return this._signJWT(userId, TokenType.activation, '1d');
    }

    public async verifyJWTActivate(token: string) {
        return this._verifyJWT(token, TokenType.activation);
    }

    private async _signJWT(userId: string, tokenType: TokenType, expiration: string) {
        const token = await new SignJWT({tokenType})
            .setProtectedHeader({alg: 'HS256'})
            .setSubject(userId)
            .setExpirationTime(expiration)
            .sign(this._jwtSecret);
        
        return token;
    }

    private async _verifyJWT(token: string, tokenType: TokenType) {
        try {
            const {payload, protectedHeader} = await jwtVerify(token, this._jwtSecret);

            if(payload.tokenType !== tokenType)
                return {isValid: false, payload: null};

            return {isValid: true, payload};
        }catch(error) {
            return {isValid: false, payload: null};
        }
    }
}