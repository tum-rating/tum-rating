import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

import * as userLocalStorage from '../auth/user.localstore.ts';

import { endpoints } from '@/api';
// import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { User } from '@/auth/useUser.tsx';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';


const convertToProperObject = (obj: any) => {
    const newObj = { ...obj };
    newObj.offeredInSemesters = [obj.semester];
    newObj.otherLecturers = [obj.professor];
    delete newObj.semester;
    return newObj;
};

async function addReview(user: User | null | undefined, newReview: ReviewInput): Promise<string | null> {
    if (!user) return null;
    const response = await fetch(endpoints.postReviewProposal, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(convertToProperObject(newReview)),
    });
    if (!response.ok) throw new ResponseError('Failed on add review request', response);

    return await response.json();
}

export interface ReviewInput {
    courseId: string;
    courseNumber: string;
    professor: string;
    course: string;
    semester: string;
}

export function useAddReview(): any {
    const user = userLocalStorage.getUser();
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newReview: ReviewInput) => addReview(user, newReview),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Course added!',
                color: 'green',
                icon: <IconCheck />,
            });
            // queryClient.invalidateQueries([QUERY_KEY.reviews]);
        },
    });
}
