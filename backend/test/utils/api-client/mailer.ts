import axios from 'axios';

export const getMail = async (to: string, subject?: string) => {
    const response = await axios.get('http://localhost:1080/email');

    return response.data.filter(email => email.to[0].address === to);
}

export const getActivationTokenFromMail = async (to: string) => {
    const mail = await getMail(to, 'Activate you account');

    if(mail.length === 0)
        return null;

    const text: string = mail[0].text;

    const searchPhrase = 'token=';

    const tokenStart = text.indexOf(searchPhrase);
                                                        // remove \n
    return text.slice(tokenStart + searchPhrase.length, -1);
}

export const getRecoveryTokenFromMail = async (to: string) => {
    const mail = await getMail(to, 'Password recovery');

    if(mail.length === 0)
        return null;

    const text: string = mail[0].text;

    const searchPhrase = 'token=';

    const tokenStart = text.indexOf(searchPhrase);
                                                        // remove \n
    return text.slice(tokenStart + searchPhrase.length, -1);
}