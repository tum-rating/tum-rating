import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => {
    const adminEmails = process.env.MAILER_ADMIN_EMAILS.split(',');

    return {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
        sender: process.env.MAILER_SENDER,
        adminEmails
    }
});
