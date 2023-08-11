const baseDomain = 'http://localhost:3000';

const api = '/api';
const apiVersion = '/v1';
const baseApiUrl = baseDomain + api + apiVersion;

const auth = {
    auth: baseApiUrl + '/auth',
    get signup() {
        return this.auth + '/signup'
    },
    get signin() {
        return this.auth + '/signin'
    },
};

export const endpoints = {
    ...auth
}