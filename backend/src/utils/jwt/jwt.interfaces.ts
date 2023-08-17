export enum TokenType {
  access = 0,
  refresh,
  activation,
  recovery,
}

export enum UserRole {
  user = 0,
  admin,
}

export interface IsJWTValidInterface<Payload> {
  isValid: boolean;
  payload: Payload;
}
