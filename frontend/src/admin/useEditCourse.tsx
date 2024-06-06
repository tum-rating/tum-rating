import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import { Course } from '@/admin/types.ts';
import { endpoints, useMutationWithAuth } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { queryClient } from '@/react-query/client.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function editCourse(token: string, course: Course, type: Method): Promise<any> {
    const body = { ...course };
    delete body._id;
    const endpoint = endpoints.editCourse(course._id);
    const response = await fetch(endpoint, {
        method: type,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
        if (!response.ok) throw new ResponseError(data.message, response, course._id);
    }
    return { course, type };
}

type Method = 'PATCH' | 'DELETE';

interface CourseEdit {
    course: Course;
    type: Method;
}

export function useEditCourse(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async ({ course, type }: CourseEdit) => editCourse(token, course, type),
        onMutate: (variables) => {
            const { course, type } = variables
            notifications.show({
                id: course._id,
                loading: true,
                title: type === 'PATCH' ? 'Editing course' : 'Removing course',
                message: <Text size="xs">{type === 'PATCH' ? 'Your course is being edited' : 'Your course is being removed'}</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return variables;
        },
        onSuccess: ({ course, type }) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.admin_detail_course, course._id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.search_query],
            });
            notifications.update({
                id: course._id,
                title: 'Success',
                message: <Text size="xs">{type === 'PATCH' ? 'Course saved' : 'Course removed'}</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}
