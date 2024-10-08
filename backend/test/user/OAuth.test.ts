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

describe('User OAuth SignIn', () => {
    it('should signup', async () => {
        const redirectURL = await getOAuthRedirectURL();

        const oidcMockUser = await OIDCCreateMockUser();

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        return supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username.startsWith('unset')).toBe(true);
            });
    });

    it('should signup and get same me user', async () => {
        const redirectURL = await getOAuthRedirectURL();

        const oidcMockUser = await OIDCCreateMockUser();

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        const signInResponse = await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect
            });
  
        await supertest(userUrl + '/me')
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.body.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(signInResponse.body.user.id);
                expect(response.body).toHaveProperty('email');
                expect(response.body.email).toBe(signInResponse.body.user.email);
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe(signInResponse.body.user.username);
                expect(response.body).not.toHaveProperty('isEmailActivated');
                expect(response.body).not.toHaveProperty('isBanned');
                expect(response.body).not.toHaveProperty('role');
                expect(response.body).not.toHaveProperty('emailDotSuffix');
                expect(response.body).not.toHaveProperty('passwordHash');
                expect(response.body).not.toHaveProperty('passwordSalt');
            });

        const userFromDB = await getUserById(signInResponse.body.user.id);
        
        expect(userFromDB).not.toBeNull();
        expect(userFromDB.id).toBe(signInResponse.body.user.id);
        expect(userFromDB.email).toBe(signInResponse.body.user.email);
        expect(userFromDB.username.startsWith('unset')).toBe(true);
        expect(userFromDB.authType).toBe(AuthType.oAuth);
        expect(userFromDB.oAuthId).toBe(oidcMockUser.sub);
        expect(userFromDB.isEmailActivated).toBe(false);
    });

    it('should signup and then sign in', async () => {
        const redirectURL = await getOAuthRedirectURL();

        const oidcMockUser = await OIDCCreateMockUser();

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username.startsWith('unset')).toBe(true);
            });

        const redirectURL2 = await getOAuthRedirectURL();

        const callbackURL2 = await performOAuthFlow(redirectURL2, oidcMockUser.email);

        const signInResponse = await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL2 })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username.startsWith('unset')).toBe(true);
            });

        return supertest(userUrl + '/me')
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.body.token)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBe(signInResponse.body.user.id);
                expect(response.body).toHaveProperty('email');
                expect(response.body.email).toBe(signInResponse.body.user.email);
                expect(response.body).toHaveProperty('username');
                expect(response.body.username).toBe(signInResponse.body.user.username);
                expect(response.body).not.toHaveProperty('isEmailActivated');
                expect(response.body).not.toHaveProperty('isBanned');
                expect(response.body).not.toHaveProperty('role');
                expect(response.body).not.toHaveProperty('emailDotSuffix');
                expect(response.body).not.toHaveProperty('passwordHash');
                expect(response.body).not.toHaveProperty('passwordSalt');
            });
    });

    it('should fail with 502 with invalid old callback url', async () => {
        const redirectURL = await getOAuthRedirectURL();

        const oidcMockUser = await OIDCCreateMockUser();

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username.startsWith('unset')).toBe(true);
            });

        const redirectURL2 = await getOAuthRedirectURL();

        await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(502)
            .expect((response) => {
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe('Invalid grant');
            });
    });

    it('should fail with 502 with invalid callback url params', async () => {
        await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: '/?random=value&and=other&params=lol' })
            .expect(502)
            .expect((response) => {
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe('Bad OAuth params');
            });
    });

    it('should fail with 403 if user oauth user is banned', async () => {
        const redirectURL = await getOAuthRedirectURL();

        const oidcMockUser = await OIDCCreateMockUser();

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        const signInResponse = await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username.startsWith('unset')).toBe(true);
            });

        await supertest(userUrl + '/me')
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.body.token)
            .expect(200);

        const adminSignInMockRequest = await signInAdminRequestMock();
        await banUser(adminSignInMockRequest.token, signInResponse.body.user.id);

        await supertest(userUrl + '/me')
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.body.token)
            .expect(403);

        const redirectURL2 = await getOAuthRedirectURL();

        const callbackURL2 = await performOAuthFlow(redirectURL2, oidcMockUser.email);

        await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL2 })
            .expect(401)
            .expect((response) => {
                expect(response.body).toHaveProperty('message');
                expect(response.body.message).toBe('User is banned');
            });
    });

    it('should send 204 for oauth account and password recovery, but send email to sign up instead of recover token', async () => {
        const redirectURL = await getOAuthRedirectURL();

        const oidcMockUser = await OIDCCreateMockUser();

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        const signInResponse = await supertest(oauthUrl)
            .post('/')
            .send({ redirectURL: callbackURL })
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username.startsWith('unset')).toBe(true);
            });

        const emailRecoveryRequest: PasswordRecoveryRequestDto = {
            email: signInResponse.body.user.email,
        };

        await supertest(authUrl + '/recovery')
            .post('/')
            .send(emailRecoveryRequest)
            .expect(204);
    
        const isLocalSignInEmailReceived = await getLocalSignInForOAuthUser(signInResponse.body.user.email);

        expect(isLocalSignInEmailReceived).toBe(true);
    });
});