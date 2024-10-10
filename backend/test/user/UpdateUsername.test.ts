import {faker} from "@faker-js/faker";
import mongoose from 'mongoose';
import * as supertest from 'supertest';


import { PasswordRecoveryRequestDto } from '@tum-rating/backend/src/modules/auth/dto/PasswordRecovery.dto';
import { authUrl } from '@tum-rating/backend/test/utils';
import { banUser, connectMongo } from '@tum-rating/backend/test/utils';
import { signInAdminRequestMock } from "@tum-rating/backend/test/utils";
import { getOAuthRedirectURL, OIDCCreateMockUser, OIDCCreateUser, performOAuthFlow } from '@tum-rating/backend/test/utils/api-client/oidc';
import { userUrl } from '@tum-rating/backend/test/utils';
import { getUserById } from '@tum-rating/backend/test/utils/db-client/user';
import { baseUrlV1 } from '@tum-rating/backend/test/utils/api-client/config';
import { AuthType } from '@tum-rating/backend/src/database/documents/user';
import { getLocalSignInForOAuthUser } from '@tum-rating/backend/test/utils/api-client/mailer';

export const oauthUrl = baseUrlV1 + '/auth/oauth';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User update username', () => {
    it('should update username', async () => {
        const signInResponse = await signInAdminRequestMock();

        const newUsername = faker.internet.userName();

        await supertest(userUrl)
            .patch('/me')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send({username: newUsername})
            .expect(204);

        const userGetMe = await supertest(userUrl + '/me')
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(signInResponse.user.id);
                expect(response.body).toHaveProperty('email');
                expect(response.body.email).toBe(signInResponse.user.email);
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe(newUsername);
            });

        expect(userGetMe.body.username != signInResponse.user.username).toBeTruthy();
    });

    it('should fail with 401 without token', async () => {
        const newUsername = faker.internet.userName();

        return supertest(userUrl)
            .patch('/me')
            .send({username: newUsername})
            .expect(401);
    });
});