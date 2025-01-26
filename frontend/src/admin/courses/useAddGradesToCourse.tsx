import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function addGradesToCourse(token: string, {courseId, semester, examType, grades}: {
    courseId: string,
    semester: string,
    examType: string,
    grades: string[]
}): Promise<any> {
    const endpoint = endpoints.addGradesToCourse(courseId);
    const response = await fetchWithServices(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            semester,
            examType,
            grades: grades.map(({grade, people}) => ({people, grade: Number(grade)}))
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, courseId);
    return {courseId, semester, examType, grades};
}

export function useAddGradesToCourse(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (params: {
            courseId: string,
            semester: string,
            examType: string,
            grades: string[]
        }) => addGradesToCourse(token, params),
        onMutate: (params) => {
            notifications.show({
                id: params.courseId,
                loading: true,
                title: 'Adding grades',
                message: <Text size="xs">Your grades are being added</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return params;
        },
        onSuccess: (params) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.detail_course, params.courseId],
            });
            notifications.update({
                id: params.courseId,
                title: 'Success',
                message: <Text size="xs">Grades added successfully</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}