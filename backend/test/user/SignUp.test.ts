import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { signUpRequestMock, authUrl } from '@tum-rating/backend/test/utils';
import { connectMongo } from '@tum-rating/backend/test/utils';
import { checkIfEmailReceived } from '@tum-rating/backend/test/utils/api-client/mailer';
import { activateUserEmail } from '@tum-rating/backend/test/utils/db-client/user';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User SignUp', () => {
    it('should signup with allowed emails domains', () => {
        const mockRequest: SignUpRequestDto = {
            email: faker.internet.email({ provider: 'mytum.de' }),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };

        return supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);
    });

    it('should fail signup with not allowed emails domains', () => {
        const mockRequest: SignUpRequestDto = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };

        return supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(400);
    });

    it('should succeed signup if email already exists and NOT activated with dedicated email sent', async () => {
        let mockRequest: SignUpRequestDto = {
            email: faker.internet.email({ provider: 'mytum.de' }),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        mockRequest.username = faker.internet.userName();

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        const isEmailSent = await checkIfEmailReceived(mockRequest.email, 'Activate your account', 2);

        expect(isEmailSent).toBe(true);
    });

    it('should succeed signup if email already exists and activated with dedicated email sent', async () => {
        let mockRequest: SignUpRequestDto = {
            email: faker.internet.email({ provider: 'mytum.de' }),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        await activateUserEmail(mockRequest.email);

        mockRequest.username = faker.internet.userName();

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        const isEmailSent = await checkIfEmailReceived(mockRequest.email, 'Email is already registered');

        expect(isEmailSent).toBe(true);
    });

    it('should fail signup with if username already exists', async () => {
        const username = faker.internet.userName();

        let mockRequest: SignUpRequestDto = {
            email: faker.internet.email({ provider: 'mytum.de' }),
            username,
            password: faker.internet.password(),
        };

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        mockRequest = {
            email: faker.internet.email({ provider: 'mytum.de' }),
            username,
            password: faker.internet.password(),
        };

        return supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(409)
            .expect((response: supertest.Response) => {
                expect(response.body.message).toContain('Username already exists');
            });
    });
});
