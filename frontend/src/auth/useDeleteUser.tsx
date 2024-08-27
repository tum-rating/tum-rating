import {notifications} from '@mantine/notifications';

import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {useSignOut} from '@/auth/useSignOut.tsx';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

const deleteUser = async (token: string) => {
    const response = await fetchWithServices(endpoints.user, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, 'delete-user');
    }
    return data;
};

const useDeleteUser = () => {
    const userTokenFromLocalStorage = userLocalStorage.getUser();
    const signOut = useSignOut();
    return useMutationWithAuth({
        mutationFn: async () => await deleteUser(userTokenFromLocalStorage),
        onSuccess: () => {
            signOut();
            notifications.show({
                color: 'blue',
                withCloseButton: true,
                className: 'sign-out-notification',
                message: 'Your account has been deleted.',
            });
        },
    });
};

export {useDeleteUser};
