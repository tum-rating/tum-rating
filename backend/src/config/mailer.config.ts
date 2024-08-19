import { registerAs } from '@nestjs/config';
import { parseStringToArray } from 'src/utils/parsers/parseStringToArray';

export default registerAs('mailer', () => {
    const adminEmails = parseStringToArray(process.env.MAILER_ADMIN_EMAILS);

    return {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
        sender: process.env.MAILER_SENDER,
        adminEmails,
        useHtmlTemplates: process.env.MAILER_USE_HTLM_TEMPLATES == 'true',
    }
});
