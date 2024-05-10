import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import * as userLocalStorage from '../auth/user.localstore.ts';

import { endpoints, useMutationWithAuth } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';


async function addCourseProposal(token: string | null, courseReview: CourseInput): Promise<string | null> {
    if (!token) return null;
    const response = await fetch(endpoints.postCourseProposal, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...courseReview }),
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response,courseReview.url);
    return data;
}

export interface CourseInput {
    url: string;
}

export function useAddCourseProposal(): any {
    const userFromLocalStorage = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (newReview: CourseInput) => addCourseProposal(userFromLocalStorage, newReview),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Course proposal has been added successfully',
                color: 'green',
                icon: <IconCheck />,
            });
        },
    });
}
