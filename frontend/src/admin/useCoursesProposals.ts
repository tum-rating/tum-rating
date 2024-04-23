import { CourseProposal } from '@/admin/types.ts';
import { endpoints } from '@/api';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';
import { useQueryWithAuth } from "@/api/useQueryWithAuth.tsx";

async function getCoursesProposals(token: string): Promise<CourseProposal[] | null> {
    const response = await fetch(endpoints.getAllProposals, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    console.log(data)
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
