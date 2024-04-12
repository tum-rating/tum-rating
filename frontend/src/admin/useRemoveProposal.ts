import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';


async function removeProposal(token:string, proposalId: string): Promise<any> {
    if (!token) return null;
    const endpoint = endpoints.removeProposal(proposalId);
    const response = await fetch(endpoint, {
        method: "DELETE",
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
            message: 'Failed' + responseData.message,
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


export function useRemoveProposal(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (proposalId: string) => removeProposal(token, proposalId),
        onMutate: (variables) => {
            notifications.show({
                id: variables,
                loading: true,
                title: 'Removing proposal',
                message: 'Your proposal is being removed',
                autoClose: false,
                withCloseButton: false,
            })
            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: ['proposals'],
            });
            notifications.update({
                id: variables._id,
                title: 'Success',
                message: 'Proposal removed',
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            })
        },
    });
}
