import axios from 'axios';
import { faker } from '@faker-js/faker';
import { SignUpRequestDto } from '@tum-rating/backend/src/modules/auth/dto/SignUpRequest.dto';
import { SignInRequestDto } from 'src/modules/auth/dto/SignInRequest.dto';
import { ActivateUserEmailRequestDto } from 'src/modules/auth/dto/ActivateUserEmail.dto';
import { baseUrlV1 } from './config';

import { activateUserEmail as activateUserEmailDB } from '@tum-rating/backend/test/utils/db-client/user';

export const authUrl = baseUrlV1 + '/auth';

export const signUpRequest = async (request: SignUpRequestDto) => {
    return axios.post(authUrl + '/signup', request);
}

/**
 * Signs up user and activates its email
 */
export const signUpRequestMock = async (request?: Partial<SignUpRequestDto>) => {
    const mockRequest: SignUpRequestDto = {
        email: faker.internet.email({provider: 'tum.de'}),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        ...request
    };

    await axios.post(authUrl + '/signup', mockRequest);

    await activateUserEmailDB(mockRequest.email);

    return mockRequest;
}

export const signInRequestMock = async (request?: Partial<SignUpRequestDto>) => {
    const signUpResponse = await signUpRequestMock(request);

    const signInRequest:SignInRequestDto = {
        email: signUpResponse.email,
        password: signUpResponse.password
    };

    const singInResponse = await axios.post(authUrl + '/signin', signInRequest);

    return {
        user: {
            ...signUpResponse,
            id: singInResponse.data.user.id
        },
        token: singInResponse.data.token
    };
}
