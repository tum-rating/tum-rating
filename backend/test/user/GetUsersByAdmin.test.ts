import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { UserRole } from '@tum-rating/backend/src/database/documents/user';
import { connectMongo } from '@tum-rating/backend/test/utils';
import { signInRequestMock, signInAdminRequestMock, userUrl } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Users By Admin', () => {

    it('should return user for admin', async () => {
        const user = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        await supertest(userUrl )
            .get('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('users');
                expect(response.body.users.length).toBeGreaterThanOrEqual(1);
                expect(response.body.users[0]).toHaveProperty('id');
                expect(response.body.users[0]).toHaveProperty('email');
                expect(response.body.users[0]).toHaveProperty('username');
                expect(response.body.users[0]).toHaveProperty('isEmailActivated');
                expect(response.body.users[0]).toHaveProperty('isBanned');
                expect(response.body.users[0]).toHaveProperty('role');
                expect(response.body.users[0]).not.toHaveProperty('emailDotSuffix');
                expect(response.body.users[0]).not.toHaveProperty('passwordHash');
                expect(response.body.users[0]).not.toHaveProperty('passwordSalt');
            });
    });

    it('should fail with 401 if no token provided', async () => {
        await supertest(userUrl)
            .get('/')
            .expect(401);
    });

    it('should fail with 403 if called without admin token', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl)
            .get('/')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(403);
    });
});
