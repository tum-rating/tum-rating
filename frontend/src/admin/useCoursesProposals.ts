import {useQuery} from '@tanstack/react-query';
import {useEffect} from 'react';

import {CourseProposal} from "@/admin/types.ts";
import {endpoints} from '@/api';
import {handleAuthErrors} from '@/api/handleErrors.tsx';
import {useSignOut} from '@/auth/useSignOut.tsx';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function getCoursesProposals(): Promise<CourseProposal[] | null> {
    const response = await fetch(endpoints.getAllProposals);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    return await data;
}

export function useCoursesProposals() {
    const signOut = useSignOut(); // get the signOut function
    const query = useQuery({
        queryKey: [QUERY_KEY.proposals],
        queryFn: async () => getCoursesProposals(),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        retry: 0,
    });

    const {error, isError} = query;
    useEffect(() => {
        if (isError) {
            handleAuthErrors({error, signOut});
        }
    }, [isError, error, signOut]);

    return query;
}