export enum TokenType {
    access = 0,
    refresh,
    activation,
    recovery
}

export interface IsJWTValidInterface<Payload> {
    isValid: boolean,
    payload: Payload
}