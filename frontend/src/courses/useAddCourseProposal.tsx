import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import * as userLocalStorage from '../auth/user.localstore.ts';

import { endpoints, useMutationWithAuth } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

const convertToProperObject = (obj: any) => {
    const newObj = { ...obj };
    newObj.offeredInSemesters = [obj.semester];
    newObj.otherLecturers = [obj.professor];
    delete newObj.semester;
    return newObj;
};

async function addReview(token: string | null, courseReview: CourseInput): Promise<string | null> {
    if (!token) return null;
    const response = await fetch(endpoints.postCourseProposal, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(convertToProperObject({ ...courseReview })),
    });
    if (!response.ok) throw new ResponseError('Failed on add review request', response);

    return await response.json();
}

export interface CourseInput {
    courseId: string;
    courseNumber: string;
    professor: string;
    name: string;
    semester: string;
}

export function useAddCourseProposal(): any {
    const userFromLocalStorage = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (newReview: CourseInput) => addReview(userFromLocalStorage, newReview),
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
