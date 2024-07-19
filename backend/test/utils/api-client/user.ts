import axios from 'axios';
import { faker } from '@faker-js/faker';
import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { SignInRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignInRequest.dto';
import { baseUrlV1 } from './config';

import { 
    activateUserEmail as activateUserEmailDB,
    changeUserRole as changeUserRoleDB, 
    changeUserRoleByEmail as changeUserRoleByEmailDB, 
} from '@tum-rating/backend/test/utils/db-client/user';
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

export const signInRequestMock = async (request?: Partial<SignUpRequestDto>, skipUserCreation = false) => {
    let signInRequest: SignInRequestDto;
    let signUpResponse: SignUpRequestDto;

    if (!skipUserCreation) {
        signUpResponse = await signUpRequestMock(request);
        
        signInRequest = {
            email: signUpResponse.email,
            password: signUpResponse.password,
        };
    } else {
        if (!request) {
            throw new Error('Request is required when user creation is skipped');
        }

        if (!request.email || !request.password) {
            throw new Error('Email and password are required when user creation is skipped');
        }

        signInRequest = {
            email: request.email,
            password: request.password,
        };
    }

    const signInResponse = await axios.post(authUrl + '/signin', signInRequest);

    return {
        user: {
            ...signInResponse.data.user,
            id: signInResponse.data.user.id,
            password: skipUserCreation ? request.password : signUpResponse.password,
        },
        token: signInResponse.data.token,
    };
};

export const signInAdminRequestMock = async (request?: Partial<SignUpRequestDto>, skipUserCreation = false) => {
    let signInRequest: SignInRequestDto;
    let signUpResponse: SignUpRequestDto;

    if (!skipUserCreation) {
        signUpResponse = await signUpRequestMock(request);
        
        signInRequest = {
            email: signUpResponse.email,
            password: signUpResponse.password,
        };
    } else {
        if (!request) {
            throw new Error('Request is required when user creation is skipped');
        }
        
        if (!request.email || !request.password) {
            throw new Error('Email and password are required when user creation is skipped');
        }
        
        signInRequest = {
            email: request.email,
            password: request.password,
        };
    }

    await changeUserRoleByEmailDB(signInRequest.email, UserRole.admin);

    const signInResponse = await axios.post(authUrl + '/signin', signInRequest);

    return {
        user: {
            ...signInResponse.data.user,
            id: signInResponse.data.user.id,
            password: skipUserCreation ? request.password : signUpResponse.password,
        },
        token: signInResponse.data.token,
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

export const deleteUserByAdmin = async (adminToken: string, userId: string) => {
    return await axios.delete(userUrl + '/' + userId, {
        headers: {
            Authorization: 'Bearer ' + adminToken,
        }
    });
};