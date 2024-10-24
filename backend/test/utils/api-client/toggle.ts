import axios from 'axios';
import { faker } from '@faker-js/faker';

import { CreateToggleRequestDto } from '@tum-rating/backend/src/modules/toggle/dto/CreateToggleRequest.dto';
import { GetToggleResponseDto } from '@tum-rating/backend/src/modules/toggle/dto/GetToggleResponse.dto';

import { baseUrlV1 } from './config';

export const toggleUrl = baseUrlV1 + '/toggles';

export const createToggleMockRequest = async (token: string, toggle?: Partial<CreateToggleRequestDto>): Promise<GetToggleResponseDto> => {
    const requestBody: CreateToggleRequestDto = {
        name: faker.lorem.word()+faker.string.uuid(),
        description: faker.lorem.words(),
        enabled: faker.datatype.boolean(),
        ...toggle,
    };

    const updateUserToggleResponse = await axios.post<GetToggleResponseDto>(`${toggleUrl}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return updateUserToggleResponse.data;
};
