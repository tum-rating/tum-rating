import { registerAs } from '@nestjs/config';
import { parseStringToArray } from 'src/utils/parsers/parseStringToArray';

export default registerAs('signup', () => {
    const acceptedEmailDomains = parseStringToArray(process.env.ACCEPTED_EMAILS_DOMAINS);

    return {
        acceptedEmailDomains,
    };
});
