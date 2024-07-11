import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    expiration_token: process.env.JWT_EXPIRATION_TOKEN,
    expiration_access: process.env.JWT_EXPIRATION_ACCESS_TOKEN,
}));
