import axios from 'axios';
import { faker } from '@faker-js/faker';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { baseUrlV1 } from './config';

import { CreateCourseRequestDto } from '@tum-rating/backend/src/modules/course/dto/CreateCourseRequest.dto';
import { CourseWithPopulatedReviews } from '@tum-rating/backend/src/database/documents/course';
import { AddReviewRequestDto } from '@tum-rating/backend/src/modules/course/dto/AddReviewRequest.dto';

export const courseUrl = baseUrlV1 + '/courses';

export const createCourseMockRequest = async (token: string, review?: Partial<CreateCourseRequestDto>) => {
    const requestBody: CreateCourseRequestDto = {
        courseId: fakeNumberOfLenght(9),
        courseNumber: fakeNumberOfLenght(8),
        name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        professor: faker.word.words(2),
        offeredInSemesters: ['2023 S', '2023 W'],
        otherLecturers: [faker.word.words(2)],
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
    return review.data as CourseWithPopulatedReviews;
};
