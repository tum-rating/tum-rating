import { registerAs } from '@nestjs/config';

export default registerAs('oauth', () => ({
    isEnabled: process.env.OAUTH_IS_ENABLED,
    issuerURL: process.env.OAUTH_ISSUER_URL,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    redirectURL: process.env.OAUTH_REDIRECT_URL,
}));
