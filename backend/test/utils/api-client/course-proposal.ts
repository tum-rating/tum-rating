import axios from 'axios';
import { faker } from '@faker-js/faker';
import { baseUrlV1 } from './config';
import { CreateCourseProposalRequestDto } from '@tum-rating/backend/src/modules/course-proposal/dto/CreateCourseProposalRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';

export const courseProposalUrl = baseUrlV1 + '/course-proposals';

export const createCourseProposalMockRequest = async (token: string, reviewProposal?: Partial<CreateCourseProposalRequestDto>) => {
    const requestBody: CreateCourseProposalRequestDto = {
        url: 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/' + fakeNumberOfLenght(9),
        ...reviewProposal,
    };

    const addCourseProposalResponse = await axios.post(`${courseProposalUrl}`, requestBody, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    });

    return {
        ...requestBody,
        id: addCourseProposalResponse.data.id,
    };
};
