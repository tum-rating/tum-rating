export const ERROR_CODE_INVALID_GRANT= 'invalid_grant';

export class InvalidGrantError extends Error {
    constructor(message) {
        super(message);
        this.name = 'invalid oauth grant';
    }
}

export class BadOAuthGatewayException extends Error {
    constructor(message) {
        super(message);
        this.name = 'bad gateway';
    }
}
