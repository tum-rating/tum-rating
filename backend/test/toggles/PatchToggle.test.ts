import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateToggleRequestDto } from '@tum-rating/backend/src/modules/toggle/dto/CreateToggleRequest.dto';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { toggleUrl } from '@tum-rating/backend/test/utils/api-client/toggle';
import e from 'express';
import { log } from 'console';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Patch Toggle', () => {
    it('should add toggle', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: CreateToggleRequestDto = {
            name: faker.lorem.word()+faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: faker.datatype.boolean(),
        };

        return supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(requestBody)
            .expect(201)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(typeof response.body.id === 'string').toBeTruthy();
                expect(response.body).toHaveProperty('name', requestBody.name);
                expect(response.body).toHaveProperty('description', requestBody.description);
                expect(response.body).toHaveProperty('enabled', requestBody.enabled);
            });
    });

    it('should add toggle without description', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: CreateToggleRequestDto = {
            name: faker.lorem.word()+faker.string.uuid(),
            enabled: faker.datatype.boolean(),
        };

        return supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(requestBody)
            .expect(201)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(typeof response.body.id === 'string').toBeTruthy();
                expect(response.body).toHaveProperty('name', requestBody.name);
                expect(response.body).toHaveProperty('description', null);
                expect(response.body).toHaveProperty('enabled', requestBody.enabled);
            });
    });

    it('should fail with 409 for non unique name', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: CreateToggleRequestDto = {
            name: faker.lorem.word()+faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: faker.datatype.boolean(),
        };

        await supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(requestBody)
            .expect(201)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(typeof response.body.id === 'string').toBeTruthy();
                expect(response.body).toHaveProperty('name', requestBody.name);
                expect(response.body).toHaveProperty('description', requestBody.description);
                expect(response.body).toHaveProperty('enabled', requestBody.enabled);
            });

        await supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(requestBody)
            .expect(409)
            .expect((response) => {
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe('Toggle with name already exists');
            }); 
    });

    it('should fail with 400 if name is missing', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: Partial<CreateToggleRequestDto> = {
            description: faker.lorem.words(),
            enabled: faker.datatype.boolean(),
        };

        return supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(requestBody)
            .expect(400);
    }); 

    it('should fail with 400 if enabled is missing', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: Partial<CreateToggleRequestDto> = {
            name: faker.lorem.word()+faker.string.uuid(),
            description: faker.lorem.words(),
        };

        return supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .send(requestBody)
            .expect(400);
    }); 

    it('should fail with 403 if called with user token', async () => {
        const singInResponse = await signInRequestMock();

        const requestBody: CreateToggleRequestDto = {
            name: faker.lorem.word()+faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: faker.datatype.boolean(),
        };

        return supertest(`${toggleUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + singInResponse.token)
            .send(requestBody)
            .expect(403)
    });

    it('should fail with 401 if called without token', async () => {
        const requestBody: CreateToggleRequestDto = {
            name: faker.lorem.word()+faker.string.uuid(),
            description: faker.lorem.words(),
            enabled: faker.datatype.boolean(),
        };

        return supertest(`${toggleUrl}`)
            .post('/')
            .send(requestBody)
            .expect(401)
    });
});
