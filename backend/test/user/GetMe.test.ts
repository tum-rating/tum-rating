import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo } from '@tum-rating/backend/test/utils';
import { signInRequestMock, signInAdminRequestMock, banUser, unbanUser, userUrl } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get User Me', () => {

    it('should return user me', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl + '/me')
            .get('/')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(user.user.id);
                expect(response.body).toHaveProperty('email');
                expect(response.body.email).toBe(user.user.email);
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe(user.user.username);
                expect(response.body).not.toHaveProperty('isEmailActivated');
                expect(response.body).not.toHaveProperty('isBanned');
                expect(response.body).not.toHaveProperty('role');
                expect(response.body).not.toHaveProperty('emailDotSuffix');
                expect(response.body).not.toHaveProperty('passwordHash');
                expect(response.body).not.toHaveProperty('passwordSalt');
            });
    });

    it('should fail with 401 if no token provided', async () => {
        await supertest(userUrl + '/me')
            .get('/')
            .expect(401);
    });
});
