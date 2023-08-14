import { registerAs } from '@nestjs/config';

export default registerAs('signup', () => {
    const acceptedEmailDomains = process.env.ACCEPTED_EMAILS_DOMAINS.split(',');
    return {
        acceptedEmailDomains
    }
});