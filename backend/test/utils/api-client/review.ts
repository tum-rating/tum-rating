import axios from 'axios';
import { faker } from '@faker-js/faker';
import { baseUrlV1 } from './config';
import { CreateReviewRequestDto } from 'src/modules/review/dto/CreateReviewRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { signInRequestMock } from './user';

export const reviewUrl = baseUrlV1 + '/reviews';

export const createCourseReviewMockRequest = async (token: string, review?: Partial<CreateReviewRequestDto>) => {
    const requestBody: CreateReviewRequestDto = {
        courseId: fakeNumberOfLenght(9),
        courseNumber: fakeNumberOfLenght(8),
        course: faker.word.words(faker.number.int({min: 2, max: 10})),
        professor: faker.word.words(2),
        ...review
    };

    const createCourseReviewResponse = await axios.post(reviewUrl, requestBody, {headers: {Authorization: 'Bearer '+token}});

    return {
        id: createCourseReviewResponse.data.id,
        ...requestBody
    }
};