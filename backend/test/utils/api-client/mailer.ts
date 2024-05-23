import axios from 'axios';

export const getMail = async (to: string, subject?: string) => {
    const response = await axios.get('http://localhost:1080/email');

    const emails = response.data.filter((email) => email.to[0].address === to);

    if (!subject) return emails;

    return emails.filter((email) => email.subject === subject);
};

export const checkIfEmailReceived = async (to: string, subject: string, receivedCount?: number) => {
    const mails = await getMail(to, subject);

    if (mails.length === 0) return false;

    if (receivedCount) {
        return mails.length === receivedCount;
    }

    return true;
};

export const getActivationTokenFromMail = async (to: string) => {
    const mail = await getMail(to, 'Activate your account');

    if (mail.length === 0) return null;

    const text: string = mail[0].html;

    const searchPhrase = 'token=';

    const tokenStart = text.indexOf(searchPhrase);

    const result = text.slice(tokenStart + searchPhrase.length, -1);

    const tokenEnd = result.indexOf('"');

    const result2 = result.slice(0, tokenEnd);

    return result2;
};

export const getRecoveryTokenFromMail = async (to: string) => {
    const mail = await getMail(to, 'Password recovery');

    if (mail.length === 0) return null;

    const text: string = mail[0].html;

    const searchPhrase = 'token=';

    const tokenStart = text.indexOf(searchPhrase);

    const result = text.slice(tokenStart + searchPhrase.length, -1);

    const tokenEnd = result.indexOf('"');

    const result2 = result.slice(0, tokenEnd);

    return result2;
};

export const getDupicatesListFromMail = async (suffix: string) => {
    const mails = await getMail('admin@email.com');

    const filterd = mails.filter(mail => mail.html.includes(suffix));

    return filterd;
};
