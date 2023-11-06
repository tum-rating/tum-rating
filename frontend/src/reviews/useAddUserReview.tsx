import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';
import { User } from '@/auth/useUser.tsx';
import * as userLocalStorage from '../auth/user.localstore.ts';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { queryClient } from '@/react-query/client.ts';

async function addUserReview(user: User | null | undefined, userReview: UserAddReviewInput, courseId: string, type: 'POST' | 'PUT'): Promise<any> {
    if (!user) return null;
    const body = { ...userReview };
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
            queryClient.invalidateQueries(['detailReview', courseId]);
            queryClient.invalidateQueries(['courses']);
        },
    });
}
