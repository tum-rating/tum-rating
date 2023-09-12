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
export interface JWTPayload {
  tokenType: TokenType,
  userRole: UserRole
}

export interface IsJWTValidInterface<Payload> {
  isValid: boolean;
  payload: Payload;
}

export interface JWTSignOptions {
  expiration: string;
  userRole: UserRole;
}
