export interface CreateUserDto {
    email: string;
    username: string;
    passwordHash: string;
    passwordSalt: string;
}
