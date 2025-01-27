import axios from 'axios';
import { faker } from '@faker-js/faker';

import { AddReviewRequestDto } from '@tum-rating/backend/src/modules/course/dto/AddReviewRequest.dto';

import { baseUrlV1 } from './config';
import { courseUrl } from './course';

export const reviewUrl =  baseUrlV1 + '/reviews';

export const addReviewMockRequest = async (token: string, reviewId: string, userId: string, userReview?: Partial<AddReviewRequestDto>): Promise<WithId<AddReviewRequestDto>> => {
    const requestBody: AddReviewRequestDto = {
        howInterestingRating: faker.number.int({ min: 0, max: 5 }),
        howEasyRating: faker.number.int({ min: 0, max: 5 }),
        comment: faker.word.words(faker.number.int({ min: 2, max: 100 })),
        semester: '2023 S',
        ...userReview,
    };

    const addUserReviewResponse = await axios.post(`${courseUrl}/${reviewId}/user/${userId}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        id: addUserReviewResponse.data.createdReviewUser['_id'],
        ...requestBody
    };
};