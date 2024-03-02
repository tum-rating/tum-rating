import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    dbName: process.env.MONGO_DB,
}));
