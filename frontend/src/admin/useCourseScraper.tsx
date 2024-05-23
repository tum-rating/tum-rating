import { useQuery } from '@tanstack/react-query';

import { Course } from './types';

import { endpoints } from '@/api';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

interface ScrapedCourseProposal {
    statusCode: number;
    course: Partial<Course> | null;
    error: any | null;
}

const getScrapedCourseProposal = async (token: string, proposalId: string): Promise<ScrapedCourseProposal> => {
    const response = await fetch(endpoints.getScrapedProposal(proposalId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, token);
    return data;
};

const useGetScrapedCourseProposal = (proposalId: string) => {
    const token = userLocalStorage.getUser();

    return useQuery({
        queryFn: async () => getScrapedCourseProposal(token, proposalId),
        queryKey: [QUERY_KEY.scrape_course, proposalId],
        enabled: false,
    });
};

export { useGetScrapedCourseProposal };
