const baseDomain = 'http://localhost:3000';

const api = '/api';
const apiVersion = '/v1';
const baseApiUrl = baseDomain + api + apiVersion;

const auth = {
    auth: baseApiUrl + '/auth',
    get signup() {
        return this.auth + '/signup';
    },
    get signin() {
        return this.auth + '/signin';
    },
    get activate() {
        return this.auth + '/activate';
    },
    get recovery() {
        return this.auth + '/recovery';
    },
    get user() {
        return this.auth + '/users/me';
    }
};


const reviews = {
    reviews: baseApiUrl + '/reviews',
}

export const endpoints = {
    ...auth,
    ...reviews
};
