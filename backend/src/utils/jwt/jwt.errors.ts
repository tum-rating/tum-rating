export class ErrorJWTInvalidTokenType extends Error {
    constructor() {
        super('JWT token type is invalid');
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ErrorJWTUndefinedRole extends Error {
    constructor() {
        super('JWT user role is undefined');
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ErrorJWTExpirationClaimFalied extends Error {
    constructor() {
        super('JWT expiration claim failed');
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export enum JWTErrorCodes {
    ERR_JWT_EXPIRED = 'ERR_JWT_EXPIRED'
}