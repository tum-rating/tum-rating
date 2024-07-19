import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';
import { connectMongo } from '@tum-rating/backend/test/utils';

import { signInRequestMock, signInAdminRequestMock, userUrl } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Delete User', () => {

    it('should delete user', async () => {
        const user = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        await supertest(userUrl)
            .delete('/' + user.user.id)
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(200)
            .expect((response) => {
                expect(response.body.id).toEqual(user.user.id);
                expect(response.body.email).toEqual(user.user.email);
                expect(response.body.username).toEqual(user.user.username);
                expect(response.body.isEmailActivated).toEqual(true);
                expect(response.body.isBanned).toEqual(false);
                expect(response.body.role).toEqual(0);
            });
    });

    it('should fail with 403 if no admin token', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl + '/' + user.user.id)
            .delete('/')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(403);
    });

    it('should fail with 401 if no token provided', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl + '/' + user.user.id)
            .delete('/')
            .expect(401);
    });

    it('should fail with 404 if user not found', async () => {
        const admin = await signInAdminRequestMock();

        await supertest(userUrl + '/' + MONGO_ZERO_ID)
            .delete('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(404);
    });
});
