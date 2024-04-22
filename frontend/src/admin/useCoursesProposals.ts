import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { CourseProposal } from '@/admin/types.ts';
import { endpoints } from '@/api';
import { handleAuthErrors } from '@/api/handleErrors.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { useSignOut } from '@/auth/useSignOut.tsx';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

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
    const signOut = useSignOut(); // get the signOut function
    const token = userLocalStorage.getUser();
    const query = useQuery({
        queryKey: [QUERY_KEY.proposals],
        queryFn: async () => getCoursesProposals(token),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        retry: 0,
    });

    const { error, isError } = query;
    useEffect(() => {
        if (isError) {
            handleAuthErrors({ error, signOut });
        }
    }, [isError, error, signOut]);

    return query;
}
