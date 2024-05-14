import { CourseProposal } from '@/admin/types.ts';
import { endpoints } from '@/api';
import { useQueryWithAuth } from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getCoursesProposals(token: string): Promise<CourseProposal[] | null> {
    const response = await fetch(endpoints.getAllProposals, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, token);
    return await data.courseProposals;
}

export function useCoursesProposals() {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY.proposals],
        queryFn: async () => getCoursesProposals(token),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        retry: 0,
    });
}
