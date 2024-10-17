import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateToggleRequestDto } from '@tum-rating/backend/src/modules/toggle/dto/CreateToggleRequest.dto';
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

describe('Get Toggle', () => {
    it('should get toggle', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);
        const toggle2 = await createToggleMockRequest(signInAdminResponse.token);

        await supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', toggle.name);
                expect(response.body).toHaveProperty('description', toggle.description);
                expect(response.body).toHaveProperty('enabled', toggle.enabled);
            });

        await supertest(`${toggleUrl}/${toggle2.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle2.id);
                expect(response.body).toHaveProperty('name', toggle2.name);
                expect(response.body).toHaveProperty('description', toggle2.description);
                expect(response.body).toHaveProperty('enabled', toggle2.enabled);
            });
    });

    it('should fail with 404 if no toggle find by id', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(`${toggleUrl}/${MONGO_ZERO_ID}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });

    it('should fail with 403 if called with user token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();
        const singInResponse = await signInRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        return supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + singInResponse.token)
            .expect(403);
    });

    it('should fail with 401 if called without token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        return supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .expect(401);
    });

    it('should fail with 400 if id is invalid', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(`${toggleUrl}/invalid_id`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });
});
