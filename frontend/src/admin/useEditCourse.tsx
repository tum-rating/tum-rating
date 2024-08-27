import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {Course} from '@/admin/types.ts';
import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function editCourse(token: string, course: Course): Promise<any> {
    const body = {...course};
    delete body._id;
    const endpoint = endpoints.editCourse(course._id);
    const response = await fetchWithServices(endpoint, {
        method: 'PATCH',
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
    return {course};
}

// useEditCourse.tsx
export function useEditCourse(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (course: Course) => editCourse(token, course),
        onMutate: (course) => {
            notifications.show({
                id: course._id,
                loading: true,
                title: 'Editing course',
                message: <Text size="xs">Your course is being edited</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return course;
        },
        onSuccess: (course) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.admin_detail_course, course.course._id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.search_query],
            });
            notifications.update({
                id: course.course._id,
                title: 'Success',
                message: <Text size="xs">Course saved</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}
