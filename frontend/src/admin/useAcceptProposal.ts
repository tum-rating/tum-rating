import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';


async function acceptProposal(token:string, proposalId: string): Promise<any> {
    if (!token) return null;
    const endpoint = endpoints.acceptProposal(proposalId);
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) throw new ResponseError('Failed on get paginated reviews request', response);
    return responseData;
}


export function useAcceptProposal(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (proposalId: string) => acceptProposal(token, proposalId),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Proposal accepted !',
                color: 'green',
            });
            queryClient.invalidateQueries({
                queryKey: ['proposals'],
            });
        },
    });
}
