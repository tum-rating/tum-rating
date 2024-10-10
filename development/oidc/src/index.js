import Provider from 'oidc-provider';
import express from 'express';
import { inMemoryStore } from './store.js';
import { configuration } from './config.js';
import { getUsers, getUserByEmail, createUser } from './users.js';

configuration.findAccount = async function findAccount(ctx, sub, token) {
    // use user login as an email
    const user = inMemoryStore.getUser(sub);

    return {
        accountId: sub,
        async claims(use, scope, claims, rejected) {
            return {
                sub: user.sub,
                email: user.email,
            };
        }
    }
};

const oidc = new Provider('http://oidc/oidc', configuration);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/users', getUsers);
app.get('/users/:email', getUserByEmail);
app.post('/users', createUser);

app.use('/oidc', oidc.callback());
app.listen(1939, () => {
    console.log('Server started');
});
