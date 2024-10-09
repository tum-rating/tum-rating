import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo } from '@tum-rating/backend/test/utils';
import { SignInResponseDto } from '@tum-rating/backend/src/modules/auth/dto/SignInResponse.dto';
import { createOAuthUser, getOAuthRedirectURL, OAuthCallback, OIDCCreateMockUser, OIDCCreateUser, performOAuthFlow } from '@tum-rating/backend/test/utils/api-client/oidc';
import { signInRequestMock } from '@tum-rating/backend/test/utils';
import { baseUrlV1 } from '@tum-rating/backend/test/utils/api-client/config';
import { getUserById } from '@tum-rating/backend/test/utils/db-client/user';
import { AuthType } from '@tum-rating/backend/src/database/documents/user';
import { SignInRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignInRequest.dto';
import { authUrl } from '@tum-rating/backend/test/utils';
import { getLocalSignInForOAuthUser } from '@tum-rating/backend/test/utils/api-client/mailer';
import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { getActivationTokenFromMail } from '@tum-rating/backend/test/utils/api-client/mailer';
import { ActivateUserEmailRequestDto } from '@tum-rating/backend/src/modules/auth/dto/ActivateUserEmail.dto';

export const oauthUrl = baseUrlV1 + '/auth/oauth';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('User Cross SignIn', () => {
    it('should signup with localflow and have auth local type', async () => {
        const signInResponse = await signInRequestMock();

        const userFromDB = await getUserById(signInResponse.user.id);

        expect(userFromDB).not.toBeNull();
        expect(userFromDB.id).toBe(signInResponse.user.id);
        expect(userFromDB.email).toBe(signInResponse.user.email);
        expect(userFromDB.authType).toBe(AuthType.local);
    });

    it('should signup with oauth and have oauth type', async () => {
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

        const signInBody = signInResponse.body as SignInResponseDto;
    
        const userFromDB = await getUserById(signInBody.user.id);

        expect(userFromDB).not.toBeNull();
        expect(userFromDB.id).toBe(signInBody.user.id);
        expect(userFromDB.email).toBe(oidcMockUser.email);
        expect(userFromDB.username.startsWith('unset')).toBe(true);
        expect(userFromDB.authType).toBe(AuthType.oAuth);
        expect(userFromDB.oAuthId).toBe(oidcMockUser.sub);
    });

    it('should signup with localflow and then use oauth with the same email', async () => {
        const signInResponse = await signInRequestMock();

        const userFromDB = await getUserById(signInResponse.user.id);

        expect(userFromDB).not.toBeNull();
        expect(userFromDB.id).toBe(signInResponse.user.id);
        expect(userFromDB.email).toBe(signInResponse.user.email);
        expect(userFromDB.username).toBe(signInResponse.user.username);
        expect(userFromDB.authType).toBe(AuthType.local);

        const redirectURL = await getOAuthRedirectURL();
        const oidcMockUser = await OIDCCreateUser(signInResponse.user.email);

        const callbackURL = await performOAuthFlow(redirectURL, oidcMockUser.email);

        const signInResponseOAuth = await OAuthCallback(callbackURL);

        const userFromDBAfterOAuthSignUp = await getUserById(signInResponse.user.id);

        expect(userFromDBAfterOAuthSignUp).not.toBeNull();
        expect(userFromDBAfterOAuthSignUp.id).toBe(signInResponse.user.id);
        expect(userFromDBAfterOAuthSignUp.email).toBe(signInResponse.user.email);
        expect(userFromDBAfterOAuthSignUp.username).toBe(signInResponse.user.username);
        expect(userFromDBAfterOAuthSignUp.authType).toBe(AuthType.both);
        expect(userFromDBAfterOAuthSignUp.oAuthId).toBe(oidcMockUser.sub);

        const signInRequest: SignInRequestDto = {
            email: signInResponse.user.email,
            password: signInResponse.user.password,
        };

        // perform local sign in again
        await supertest(baseUrlV1 + '/auth/signin')
            .post('/')
            .send(signInRequest)
            .expect(200)
            .expect((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oidcMockUser.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username).toBe(signInResponse.user.username);
            });
        
        const redirectURL2 = await getOAuthRedirectURL();

        const callbackURL2 = await performOAuthFlow(redirectURL2, oidcMockUser.email);

        const signInResponseOAuth2 = await OAuthCallback(callbackURL2);
        
        expect(signInResponseOAuth2.user.id).toBe(signInResponse.user.id);
        expect(signInResponseOAuth2.user.email).toBe(signInResponse.user.email);
        expect(signInResponseOAuth2.user.username).toBe(signInResponse.user.username);
    });

    it('should signup with oauth and then use localflow with the same email', async () => {
        const oauthUser = await createOAuthUser();

        await supertest(authUrl)
            .post('/signin')
            .send({
                email: oauthUser.user.email,
                password: 'password',
            })
            .expect(401);

        // mail sent to inform that email is already registered with oAuth
        const isLocalSignInEmailReceived = await getLocalSignInForOAuthUser(oauthUser.user.email);

        expect(isLocalSignInEmailReceived).toBe(true);

        // perform signup with local flow
        const mockRequest: SignUpRequestDto = {
            email: oauthUser.user.email, 
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };

        await supertest(authUrl + '/signup')
            .post('/')
            .send(mockRequest)
            .expect(201);

        const token = await getActivationTokenFromMail(oauthUser.user.email);

        if (!token) throw new Error('token not present');

        const mockSignInRequest: SignInRequestDto = {
            email: oauthUser.user.email,
            password: mockRequest.password,
        };

        await supertest(authUrl + '/signin')
            .post('/')
            .send(mockSignInRequest)
            .expect(401);

        const requestActivate: ActivateUserEmailRequestDto = {
            token,
        };

        await supertest(authUrl + '/activate')
            .post('/')
            .send(requestActivate)
            .expect(204);

        return supertest(authUrl + '/signin')
            .post('/')
            .send(mockSignInRequest)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('id');
                expect(response.body.user).toHaveProperty('email');
                expect(response.body.user.email).toBe(oauthUser.user.email);
                expect(response.body.user).toHaveProperty('username');
                expect(response.body.user.username).toBe(mockRequest.username);
            });
    });
});