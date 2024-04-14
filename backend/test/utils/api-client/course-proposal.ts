import axios from 'axios';
import { faker } from '@faker-js/faker';
import { baseUrlV1 } from './config';
import { CreateCourseProposalRequestDto } from '@tum-rating/backend/src/modules/course-proposal/dto/CreateCourseProposalRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';

export const courseProposalUrl = baseUrlV1 + '/course-proposals';

export const createCourseProposalMockRequest = async (token: string, reviewProposal?: Partial<CreateCourseProposalRequestDto>) => {
    const requestBody: CreateCourseProposalRequestDto = {
        courseId: fakeNumberOfLenght(9),
        courseNumber: fakeNumberOfLenght(8),
        name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        professor: faker.word.words(2),
        offeredInSemesters: ['SS 2023', 'WS 2023'],
        ...reviewProposal,
    };

    const addUserReviewResponse = await axios.post(`${courseProposalUrl}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        ...requestBody,
        id: addUserReviewResponse.data.id,
    };
};
