import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateToggleRequestDto } from '@tum-rating/backend/src/modules/toggle/dto/CreateToggleRequest.dto';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { toggleUrl } from '@tum-rating/backend/test/utils/api-client/toggle';
import { createToggleMockRequest } from '@tum-rating/backend/test/utils/api-client/toggle';
import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';
import { dropAllToggles } from '@tum-rating/backend/test/utils/db-client/toggle';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Toggles', () => {

    beforeEach(async () => {
        await dropAllToggles();
    });

    it('should get all toggles', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const toggles = [];

        for (let i = 0; i < 5; i++) {
            const toggle = await createToggleMockRequest(signInAdminResponse.token);
            toggles.push(toggle);
        }

        await supertest(`${toggleUrl}`)
            .get('/')
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('toggles');
                expect(response.body.toggles.length).toBe(5);
                expect(response.body.toggles).toEqual(expect.arrayContaining(toggles));
            });
    });
});
