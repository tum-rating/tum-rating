import {useQuery} from "@tanstack/react-query";

import * as userLocalStorage from '@/auth/user.localstore.ts';
import {endpoints} from "@/api";
import {QUERY_KEY} from "@/constants/queryKeys.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";
import {Course} from "./types";

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
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    return data;
}

const useGetScrapedCourseProposal = (proposalId: string) => {
    const token = userLocalStorage.getUser();

    return useQuery({
        queryFn: async () => getScrapedCourseProposal(token, proposalId),
        queryKey: [QUERY_KEY.scrape_course, proposalId],
        enabled: false
    })
}

export {useGetScrapedCourseProposal}