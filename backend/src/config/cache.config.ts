import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
    ttlMinutes: process.env.CACHE_TTL_MINUTES,
}));
