import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import { endpoints, useMutationWithAuth } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { queryClient } from '@/react-query/client.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function removeProposal(token: string, proposalId: string): Promise<any> {
    if (!token) return null;
    const endpoint = endpoints.removeProposal(proposalId);
    const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, proposalId);
    }
    data._id = proposalId;
    return data;
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
                message: <Text size="xs">Your proposal is being removed</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.proposals],
            });
            notifications.update({
                id: variables._id,
                title: 'Success',
                message: <Text size="xs">Proposal removed</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}
