import axios from 'axios';
import { faker } from '@faker-js/faker';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { baseUrlV1 } from './config';

import { CreateCourseRequestDto } from '@tum-rating/backend/src/modules/course/dto/CreateCourseRequest.dto';
import { Course } from '@tum-rating/backend/src/database/documents/course';
import { AddReviewRequestDto } from '@tum-rating/backend/src/modules/course/dto/AddReviewRequest.dto';

export const courseUrl = baseUrlV1 + '/courses';

export const createCourseMockRequest = async (token: string, review?: Partial<CreateCourseRequestDto>) => {
    const requestBody: CreateCourseRequestDto = {
        courseId: fakeNumberOfLenght(9),
        courseNumber: fakeNumberOfLenght(8),
        name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        professor: faker.word.words(2),
        offeredInSemesters: ['SS 2023', 'WS 2023'],
        ...review,
    };

    const createCourseResponse = await axios.post(courseUrl, requestBody, { headers: { Authorization: 'Bearer ' + token } });

    return {
        id: createCourseResponse.data.id,
        ...requestBody,
    };
};

export const getCourseById = async (id: string) => {
    const review = await axios.get(courseUrl + '/' + id);
    return review.data as Course;
};

export const addReviewMockRequest = async (token: string, reviewId: string, userId: string, userReview?: Partial<AddReviewRequestDto>) => {
    const requestBody: AddReviewRequestDto = {
        howInterestingRating: faker.number.int({ min: 0, max: 5 }),
        howEasyRating: faker.number.int({ min: 0, max: 5 }),
        comment: faker.word.words(faker.number.int({ min: 2, max: 100 })),
        semester: 'SS 2023',
        ...userReview,
    };

    const addUserReviewResponse = await axios.post(`${courseUrl}/${reviewId}/user/${userId}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        userReview: requestBody,
    };
};
