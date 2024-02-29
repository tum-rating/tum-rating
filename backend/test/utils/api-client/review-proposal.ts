import axios from 'axios';
import { faker } from '@faker-js/faker';
import { baseUrlV1 } from './config';
import { CreateReviewProposalRequestDto } from '@tum-rating/backend/src/modules/review-proposal/dto/CreateReviewProposalRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';

export const reviewProposalUrl = baseUrlV1 + '/review-proposals';

export const createReviewProposalMockRequest = async (token: string, reviewProposal?: Partial<CreateReviewProposalRequestDto>) => {
    const requestBody: CreateReviewProposalRequestDto = {
        courseId: fakeNumberOfLenght(9),
        courseNumber: fakeNumberOfLenght(8),
        course: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        professor: faker.word.words(2),
        offeredInSemesters: ['SS 2023', 'WS 2023'],
        ...reviewProposal,
    };

    const addUserReviewResponse = await axios.post(`${reviewProposalUrl}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        ...requestBody,
        id: addUserReviewResponse.data.id,
    };
};
