import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {QUERY_KEY} from "@/constants/queryKeys.ts";
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
    if (!response.ok) {
        notifications.update({
            id: proposalId,
            title: 'Error',
            message: 'Failed to accept proposal: ' + responseData.message,
            autoClose: false,
            withCloseButton: true,
            color: 'red',
            loading: false,
        })
        throw new ResponseError("error", response);
    }
    responseData._id = proposalId;
    return responseData;
}


export function useAcceptProposal(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (proposalId: string) => acceptProposal(token, proposalId),
        onMutate: (variables) => {
            notifications.show({
                id: variables,
                loading: true,
                title: 'Accepting proposal',
                message: 'Your proposal is being accepted',
                autoClose: false,
                withCloseButton: false,
            })
            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.proposals],
            });
            notifications.update({
                id: variables._id,
                title: 'Success',
                message: 'Proposal accepted',
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            })
        },
    });
}
