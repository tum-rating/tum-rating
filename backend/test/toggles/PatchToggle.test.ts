import { en, fa, faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { UpdateToggleRequestDto } from '@tum-rating/backend/src/modules/toggle/dto/UpdateToggleRequest.dto';
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

describe('Patch Toggle', () => {
    it('should patch toggle', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: !toggle.enabled,
        };

        await supertest(`${toggleUrl}/${toggle.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(updateToggleBody)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', updateToggleBody.name);
                expect(response.body).toHaveProperty('description', updateToggleBody.description);
                expect(response.body).toHaveProperty('enabled', updateToggleBody.enabled);
            });

        return supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', updateToggleBody.name);
                expect(response.body).toHaveProperty('description', updateToggleBody.description);
                expect(response.body).toHaveProperty('enabled', updateToggleBody.enabled);
            });
    });

    it('should patch toggle with only name', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
        };

        await supertest(`${toggleUrl}/${toggle.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(updateToggleBody)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', updateToggleBody.name);
                expect(response.body).toHaveProperty('description', toggle.description);
                expect(response.body).toHaveProperty('enabled', toggle.enabled);
            });

        return supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', updateToggleBody.name);
                expect(response.body).toHaveProperty('description', toggle.description);
                expect(response.body).toHaveProperty('enabled', toggle.enabled);
            });
    });

    it('should patch toggle with only enabled', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        const updateToggleBody: UpdateToggleRequestDto = {
            enabled: !toggle.enabled,
        };

        await supertest(`${toggleUrl}/${toggle.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(updateToggleBody)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', toggle.name);
                expect(response.body).toHaveProperty('description', toggle.description);
                expect(response.body).toHaveProperty('enabled', updateToggleBody.enabled);
            });

        return supertest(`${toggleUrl}/${toggle.id}`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id', toggle.id);
                expect(response.body).toHaveProperty('name', toggle.name);
                expect(response.body).toHaveProperty('description', toggle.description);
                expect(response.body).toHaveProperty('enabled', updateToggleBody.enabled);
            });
    });

    it('should fail with 404 if no toggle find by id', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: false,
        };

        return supertest(`${toggleUrl}/${MONGO_ZERO_ID}`)
            .patch('/')
            .send(updateToggleBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });

    it('should fail with 403 if called with user token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();
        const singInResponse = await signInRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: !toggle.enabled,
        };

        return supertest(`${toggleUrl}/${toggle.id}`)
            .patch('/')
            .send(updateToggleBody)
            .set('Authorization', 'Bearer ' + singInResponse.token)
            .expect(403);
    });

    it('should fail with 401 if called without token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: !toggle.enabled,
        };

        return supertest(`${toggleUrl}/${toggle.id}`)
            .patch('/')
            .send(updateToggleBody)
            .expect(401);
    });

    it('should fail with 400 if id is invalid', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: false,
        };

        return supertest(`${toggleUrl}/invalid_id`)
            .patch('/')
            .send(updateToggleBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });

    it('should fail with 400 if id is invalid', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const updateToggleBody: UpdateToggleRequestDto = {
            name: faker.lorem.word() + faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: false,
        };

        return supertest(`${toggleUrl}/invalid_id`)
            .patch('/')
            .send(updateToggleBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });

    it('should fail with 400 if no props in body', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggle = await createToggleMockRequest(signInAdminResponse.token);

        const updateToggleBody: UpdateToggleRequestDto = {
        };

        return supertest(`${toggleUrl}/${toggle.id}`)
            .patch('/')
            .send(updateToggleBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });
});
