import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { SignInRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SigninRequest.dto';
import { signUpRequestMock, authUrl } from '@tum-rating/backend/test/utils';
import { connectMongo } from '@tum-rating/backend/test/utils';
import { setUserBan } from '@tum-rating/backend/test/utils/db-client/user';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User SignIn', () => {
    it('should signin', async () => {
        const signUpResponse = await signUpRequestMock();

        const mockRequest: SignInRequestDto = {
            email: signUpResponse.email,
            password: signUpResponse.password,
        };

        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockRequest)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('token');
            });
    });

    it('should fail if email is not activated', async () => {
        const mockRequest: SignUpRequestDto = {
            email: faker.internet.email({ provider: 'tum.de' }),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        const mockSignInRequest: SignInRequestDto = {
            email: mockRequest.email,
            password: mockRequest.password,
        };

        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockSignInRequest)
            .expect(401);
    });

    it('should fail signin with wrong password', async () => {
        const signUpResponse = await signUpRequestMock();

        const mockRequest: SignInRequestDto = {
            email: signUpResponse.email,
            password: faker.internet.password(),
        };

        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockRequest)
            .expect(401);
    });

    it('should fail signin with not existing email', async () => {
        const signUpResponse = await signUpRequestMock();

        const mockRequest: SignInRequestDto = {
            email: faker.internet.email(),
            password: signUpResponse.password,
        };

        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockRequest)
            .expect(401);
    });

    it('should fail signin if user is banned', async () => {
        const signUpResponse = await signUpRequestMock();

        const mockRequest: SignInRequestDto = {
            email: faker.internet.email(),
            password: signUpResponse.password,
        };

        await setUserBan(signUpResponse.email, true);

        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockRequest)
            .expect(401);
    });
});
