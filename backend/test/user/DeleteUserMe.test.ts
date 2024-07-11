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

describe('Delete User Me', () => {

    it('should delete user me', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl)
            .get('/me')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(200);

        await supertest(userUrl)
            .delete('/me')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(200)
            .expect((response) => {
                expect(response.body.id).toEqual(user.user.id);
                expect(response.body.email).toEqual(user.user.email);
                expect(response.body.username).toEqual(user.user.username);
                expect(response.body.isEmailActivated).toBeUndefined();
                expect(response.body.isBanned).toBeUndefined();
                expect(response.body.role).toBeUndefined();
                expect(response.body.passwordHash).toBeUndefined();
                expect(response.body.passwordSalt).toBeUndefined();
            });

        await supertest(userUrl)
            .get('/me')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(404);

    });

    it('should fail with 401 if no token', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl)
            .delete('/me')
            .expect(401);
    });

    it('should fail with 404 if user not found', async () => {
        const user = await signInRequestMock();

        await supertest(userUrl)
            .get('/me')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(200);

        await supertest(userUrl)
            .delete('/me')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(200)
            .expect((response) => {
                expect(response.body.id).toEqual(user.user.id);
                expect(response.body.email).toEqual(user.user.email);
                expect(response.body.username).toEqual(user.user.username);
                expect(response.body.isEmailActivated).toBeUndefined();
                expect(response.body.isBanned).toBeUndefined();
                expect(response.body.role).toBeUndefined();
                expect(response.body.passwordHash).toBeUndefined();
                expect(response.body.passwordSalt).toBeUndefined();
            });

        await supertest(userUrl)
            .delete('/me')
            .set('Authorization', 'Bearer ' + user.token)
            .expect(404)
    });
});
