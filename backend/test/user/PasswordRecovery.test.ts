import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { PasswordRecoveryRequestDto } from 'src/modules/auth/dto/PasswordRecovery.dto';
import { SignInRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SigninRequest.dto';
import { authUrl } from '@tum-rating/backend/test/utils';
import { connectMongo } from '@tum-rating/backend/test/utils';
import { getRecoveryTokenFromMail } from '@tum-rating/backend/test/utils/api-client/mailer';
import { signUpRequestMock } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User Password Recovery', () => {
    it('should recover user password', async () => {
        const signUpResponse = await signUpRequestMock();

        const emailRecoveryRequest: PasswordRecoveryRequestDto = {
            email: signUpResponse.email,
        }

        supertest(authUrl + '/recovery')
            .post('/')
            .send(emailRecoveryRequest)
            .expect(204);

        const recoveryToken = await getRecoveryTokenFromMail(signUpResponse.email);

        const recoveryRequest: PasswordRecoveryRequestDto = {
            password: faker.internet.password(),
            token: recoveryToken
        };

        supertest(authUrl + '/recovery')
            .post('/')
            .send(recoveryRequest)
            .expect(204);

        const signInRequestWithOldPassword: SignInRequestDto = {
            email: signUpResponse.email,
            password: signUpResponse.password
        };

        supertest(authUrl + 'signin')
            .post('/')
            .send(signInRequestWithOldPassword)
            .expect(401)

        const signInRequestWithNewPassowrd: SignInRequestDto = {
            email: signUpResponse.email,
            password: recoveryRequest.password
        };

        supertest(authUrl + 'signin')
            .post('/')
            .send(signInRequestWithNewPassowrd)
            .expect(200)
    });

    it('should fail with invalid token', async () => {
        const signUpResponse = await signUpRequestMock();

        const emailRecoveryRequest: PasswordRecoveryRequestDto = {
            email: signUpResponse.email,
        }

        supertest(authUrl + '/recovery')
            .post('/')
            .send(emailRecoveryRequest)
            .expect(204);

        const recoveryToken = await getRecoveryTokenFromMail(signUpResponse.email);
        
        const recoveryRequest: PasswordRecoveryRequestDto = {
            password: faker.internet.password(),
            token: recoveryToken
        };

        supertest(authUrl + '/recovery')
            .post('/')
            .send('eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlblR5cGUiOjIsInN1YiI6IjY0ZTI4MDE3NGUwMGZkZjgzZGNlODk1ZiIsImV4cCI6MTY5MjY1MTkyN30.SIRt6KtlK-sFig1RUESLyApBH_F56OG3-9BEjD8QLPW')
            .expect(204);
    });

    it('should silently fail if email is not registered', async () => {
        const emailRecoveryRequest: PasswordRecoveryRequestDto = {
            email: faker.internet.email() 
        }

        supertest(authUrl + '/recovery')
            .post('/')
            .send(emailRecoveryRequest)
            .expect(204);

        const recoveryToken = await getRecoveryTokenFromMail(emailRecoveryRequest.email);
        
        expect(recoveryToken).toBe(null);
    });
});