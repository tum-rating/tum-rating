import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { toggleUrl } from '@tum-rating/backend/test/utils/api-client/toggle';
import { createToggleMockRequest } from '@tum-rating/backend/test/utils/api-client/toggle';
import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Delte Toggle', () => {
    it('should delete toggle', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        await supertest(`${toggleUrl}/${toggle.id}`)
            .delete('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(204);

        await supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });

    it('should fail with 404 if deleted twice', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        await supertest(`${toggleUrl}/${toggle.id}`)
            .delete('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(204);

        await supertest(`${toggleUrl}/${toggle.id}`)
            .delete('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });

    it('should fail with 404 if no toggle find by id', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(`${toggleUrl}/${MONGO_ZERO_ID}`)
            .delete('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });

    it('should fail with 403 if called with user token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();
        const singInResponse = await signInRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        return supertest(`${toggleUrl}/${toggle.id}`)
            .delete('/')
            .set('Authorization', 'Bearer ' + singInResponse.token)
            .expect(403);
    });

    it('should fail with 401 if called without token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        return supertest(`${toggleUrl}/${toggle.id}`)
            .delete('/')
            .expect(401);
    });

    it('should fail with 400 if id is invalid', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(`${toggleUrl}/invalid_id`)
            .delete('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });
});
