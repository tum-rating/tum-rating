import { signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils/api-client/user';
import { connectMongo } from '@tum-rating/backend/test/utils';

import mongoose from 'mongoose';

const printUser = (signInResponse, password) => {
    console.log('---------------------------------');
    console.log('id:', signInResponse.user.id);
    console.log('email:', signInResponse.user.email);
    console.log('username:', signInResponse.user.username);
    console.log('password:', password);
    console.log('token', signInResponse.token);
    console.log('---------------------------------');
};

(async () => {
    await connectMongo();

    console.log('Users:');

    // user might already exist
    const adamSignInConfig ={
        email: 'adam@tum.de',
        username: 'malysz',
        password: 'adam',
    };

    try {
        const adamSignInResponse = await signInRequestMock(adamSignInConfig);
        printUser(adamSignInResponse, adamSignInConfig.password);
    } catch(error) {
        if (error.response.status !== 409) {
            throw error;
        }

        const adamSignInResponse = await signInRequestMock(adamSignInConfig, true);
        printUser(adamSignInResponse, adamSignInConfig.password);
    }


    const signInResponse = await signInRequestMock();
    printUser(signInResponse, signInResponse.user.password);

    console.log('Admins:');

    const mariusSignInConfig = {
        email: 'mariusz@tum.de',
        username: 'pudzian',
        password: 'mariusz',
    };
    try {
        const mariuszSignInResponse = await signInAdminRequestMock(mariusSignInConfig);
        printUser(mariuszSignInResponse, mariusSignInConfig.password);
    } catch(error) {
        if (error.response.status !== 409) {
            throw error;
        }

        const mariuszSignInResponse = await signInAdminRequestMock(mariusSignInConfig, true);
        printUser(mariuszSignInResponse, mariusSignInConfig.password);
    }

    const signInAdminResponse = await signInAdminRequestMock();
    printUser(signInAdminResponse, signInAdminResponse.user.password); 

    await mongoose.disconnect();
})();
