import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError';
import { User } from '@/auth/useUser';
import * as userLocalStorage from '../auth/user.localstore';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { queryClient } from '@/react-query/client';

async function addUserReview(user: User | null | undefined, userReview: UserAddReviewInput, courseId: string, type: 'POST' | 'PUT'): Promise<any> {
    if (!user) return null;
    const body = { ...userReview };

    console.log(type);
    const endpoint = endpoints.postSpecificReview(courseId, String(user.user.id));
    const response = await fetch(endpoint, {
        method: type,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
    });
    const responseData = await response.json();
    if (!response.ok) throw new ResponseError('Failed on get paginated reviews request', response);
    return responseData;
}

export interface UserAddReviewInput {
    howInterestingRating: number;
    howEasyRating: number;
    comment: string;
    semester: string;
}

export function useAddUserReview(courseId: string, type: 'POST' | 'PUT'): any {
    console.log(type);
    const user = userLocalStorage.getUser();
    return useMutation({
        mutationFn: async (newReview: UserAddReviewInput) => addUserReview(user, newReview, courseId, type),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Success !',
                color: 'green',
                icon: <IconCheck />,
            });
            console.log(courseId);
            queryClient.invalidateQueries(['detailReview', courseId]);
            queryClient.invalidateQueries(['courses']);
        },
    });
}
