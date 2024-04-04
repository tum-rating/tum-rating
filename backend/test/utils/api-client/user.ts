import axios from 'axios';
import { faker } from '@faker-js/faker';
import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { SignInRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignInRequest.dto';
import { baseUrlV1 } from './config';

import { activateUserEmail as activateUserEmailDB, changeUserRole as changeUserRoleDB } from '@tum-rating/backend/test/utils/db-client/user';
import { UserRole } from '@tum-rating/backend/src/database/documents/user';

export const authUrl = baseUrlV1 + '/auth';
export const userUrl = baseUrlV1 + '/users';

export const signUpRequest = async (request: SignUpRequestDto) => {
    return axios.post(authUrl + '/signup', request);
};

/**
 * Signs up user and activates its email
 */
export const signUpRequestMock = async (request?: Partial<SignUpRequestDto>) => {
    const mockRequest: SignUpRequestDto = {
        email: faker.internet.email({ provider: 'tum.de' }),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        ...request,
    };

    await axios.post(authUrl + '/signup', mockRequest);

    await activateUserEmailDB(mockRequest.email);

    return mockRequest;
};

export const signInRequestMock = async (request?: Partial<SignUpRequestDto>) => {
    const signUpResponse = await signUpRequestMock(request);

    const signInRequest: SignInRequestDto = {
        email: signUpResponse.email,
        password: signUpResponse.password,
    };

    const signInResponse = await axios.post(authUrl + '/signin', signInRequest);

    return {
        user: {
            ...signUpResponse,
            id: signInResponse.data.user.id,
        },
        token: signInResponse.data.token,
    };
};

export const signInAdminRequestMock = async (request?: Partial<SignUpRequestDto>) => {
    const signInResponse = await signInRequestMock(request);

    await changeUserRoleDB(signInResponse.user.id, UserRole.admin);

    const signInRequest: SignInRequestDto = {
        email: signInResponse.user.email,
        password: signInResponse.user.password,
    };

    const signInResponse2 = await axios.post(authUrl + '/signin', signInRequest);

    return {
        user: {
            ...signInResponse2.data,
            id: signInResponse2.data.user.id,
        },
        token: signInResponse2.data.token,
    };
};

export const banUser = async (adminToken: string, userId: string) => {
    return await axios.post(userUrl + '/' + userId + '/ban', {}, {
        headers: {
            Authorization: 'Bearer ' + adminToken,
        },
    });
};

export const unbanUser = async (adminToken: string, userId: string) => {
    return await axios.delete(userUrl + '/' + userId + '/ban', {
        headers: {
            Authorization: 'Bearer ' + adminToken,
        },
    });
};