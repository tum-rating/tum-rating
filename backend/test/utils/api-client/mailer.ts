import axios from 'axios';

export const getMail = async (to: string, subject?: string) => {
    const response = await axios.get('http://localhost:1080/email');

    return response.data.filter((email) => email.to[0].address === to);
};

export const getActivationTokenFromMail = async (to: string) => {
    const mail = await getMail(to, 'Activate you account');

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

