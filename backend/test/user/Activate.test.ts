import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { ActivateUserEmailRequestDto } from '@tum-rating/backend/src/modules/auth/dto/ActivateUserEmail.dto';
import { SignInRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SigninRequest.dto';
import { authUrl } from '@tum-rating/backend/test/utils';
import { connectMongo } from '@tum-rating/backend/test/utils';
import { getActivationTokenFromMail } from '@tum-rating/backend/test/utils/api-client/mailer';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('UserActivation', () => {
    it('should activate user', async () => {

        const signInRequest: SignUpRequestDto = {
            email: faker.internet.email({provider: 'tum.de'}),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        }

        await supertest(authUrl + '/signup')
            .post('/')
            .send(signInRequest)
            .expect(201);

        const token = await getActivationTokenFromMail(signInRequest.email);

        if(!token)
            throw new Error('token not present');

            
        const mockSignInRequest: SignInRequestDto = {
            email: signInRequest.email,
            password: signInRequest.password
        };
        
        await supertest(authUrl + '/signin')
            .post('/')
            .send(mockSignInRequest)
            .expect(401);
            
        const requestActivate: ActivateUserEmailRequestDto = {
            token
        };

        await supertest(authUrl + '/activate')
            .post('/')
            .send(requestActivate)
            .expect(204);


        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockSignInRequest)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('token')
            });
    });
});