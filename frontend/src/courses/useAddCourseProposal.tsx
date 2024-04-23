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
    if (!response.ok) throw new ResponseError('Failed on add review request', response);

    return await response.json();
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
