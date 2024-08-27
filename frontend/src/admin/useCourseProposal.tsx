import {endpoints} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {useQueryWithAuth} from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

const getCourseProposal = async (token: string, courseProposalId: string) => {
    const endpoint = endpoints.getSingleProposal(courseProposalId);
    const response = await fetchWithServices(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, courseProposalId);
    }
    return data;
};

const useCourseProposal = (courseProposalId: string) => {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY['admin_course_proposal_details'], courseProposalId],
        queryFn: async () => getCourseProposal(token, courseProposalId),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export {useCourseProposal};
