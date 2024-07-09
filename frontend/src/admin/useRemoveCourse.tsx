import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

const removeCourse = async (token: string, courseId: string): Promise<any> => {
    const endpoint = endpoints.editCourse(courseId);
    const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, courseId);
    }
    return courseId;
};

export function useRemoveCourse(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (courseId: string) => removeCourse(token, courseId),
        onMutate: (courseId) => {
            notifications.show({
                id: courseId,
                loading: true,
                title: 'Removing course',
                message: <Text size="xs">Your course is being removed</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return courseId;
        },
        onSuccess: (courseId) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.admin_detail_course, courseId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.search_query],
            });
            notifications.update({
                id: courseId,
                title: 'Success',
                message: <Text size="xs">Course removed</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}
