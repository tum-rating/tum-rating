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

describe('Get User By Admin', () => {

    it('should return user for admin', async () => {
        const user = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        await supertest(userUrl + '/' + user.user.id)
            .get('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(user.user.id);
                expect(response.body).toHaveProperty('email');
                expect(response.body.email).toBe(user.user.email);
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe(user.user.username);
                expect(response.body).toHaveProperty('isEmailActivated');
                expect(response.body.isEmailActivated).toBe(true);
                expect(response.body).toHaveProperty('isBanned');
                expect(response.body.isBanned).toBe(false);
                expect(response.body).toHaveProperty('role');
                expect(response.body.role).toBe(UserRole.user);
                expect(response.body).not.toHaveProperty('emailDotSuffix');
                expect(response.body).not.toHaveProperty('passwordHash');
                expect(response.body).not.toHaveProperty('passwordSalt');
            });
    });

    it('should return 404', async () => {
        const admin = await signInAdminRequestMock();

        await supertest(userUrl + '/' + '000000000000000000000000')
            .get('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(404)
    });

    it('should fail with 401 if no token provided', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl + '/' + user.user.id)
            .get('/')
            .expect(401);
    });

    it('should fail with 403 if called without admin token', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl + '/' + user.user.id)
            .get('/')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(403);
    });
});
