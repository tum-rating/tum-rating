import axios from 'axios';
import { faker } from '@faker-js/faker';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { baseUrlV1 } from './config';

import { CreateCourseRequestDto } from '@tum-rating/backend/src/modules/review/dto/CreateReviewRequest.dto';
import { Review } from '@tum-rating/backend/src/database/documents/review';
import { AddUserReviewRequestDto } from '@tum-rating/backend/src/modules/review/dto/AddUserReviewRequest.dto';

export const reviewUrl = baseUrlV1 + '/reviews';

export const createCourseReviewMockRequest = async (token: string, review?: Partial<CreateCourseRequestDto>) => {
    const requestBody: CreateCourseRequestDto = {
        courseId: fakeNumberOfLenght(9),
        courseNumber: fakeNumberOfLenght(8),
        name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        professor: faker.word.words(2),
        offeredInSemesters: ['SS 2023', 'WS 2023'],
        ...review,
    };

    const createCourseReviewResponse = await axios.post(reviewUrl, requestBody, { headers: { Authorization: 'Bearer ' + token } });

    return {
        id: createCourseReviewResponse.data.id,
        ...requestBody,
    };
};

export const getCourseReviewById = async (id: string) => {
    const review = await axios.get(reviewUrl + '/' + id);
    return review.data as Review;
};

export const addUserReviewMockRequest = async (token: string, reviewId: string, userId: string, userReview?: Partial<AddUserReviewRequestDto>) => {
    const requestBody: AddUserReviewRequestDto = {
        howInterestingRating: faker.number.int({ min: 0, max: 5 }),
        howEasyRating: faker.number.int({ min: 0, max: 5 }),
        comment: faker.word.words(faker.number.int({ min: 2, max: 100 })),
        semester: 'SS 2023',
        ...userReview,
    };

    const addUserReviewResponse = await axios.post(`${reviewUrl}/${reviewId}/user/${userId}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        userReview: requestBody,
    };
};
