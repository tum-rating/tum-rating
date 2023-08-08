import { registerAs } from '@nestjs/config';

export default registerAs('webapp', () => ({
    protocol: process.env.WEBAPP_PROTOCOL,
    host: process.env.WEBAPP_HOST,
    port: process.env.WEBAPP_PORT,
    get url() {
        return `${this.protocol}://${this.host}:${this.port}`
    }
}));