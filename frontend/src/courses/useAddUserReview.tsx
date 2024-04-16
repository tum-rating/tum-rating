import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {User, useUser} from '@/auth/useUser.tsx';
import {QUERY_KEY} from "@/constants/queryKeys.ts";
import { queryClient } from '@/react-query/client.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

interface UserWithToken extends User {
    token: string
}

async function addUserReview(user: UserWithToken | null | undefined, userReview: UserAddReviewInput, courseId: string, type: 'POST' | 'PATCH'): Promise<any> {
    if (!user) return null;
    const body = { ...userReview };
    const endpoint = endpoints.postSpecificReview(courseId, String(user.id));
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

export function useAddUserReview(courseId: string, type: 'POST' | 'PATCH'): any {
    const {data} = useUser();
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (newReview: UserAddReviewInput) => addUserReview({...data,token: token}, newReview, courseId, type),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Success !',
                color: 'green',
                icon: <IconCheck />,
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.detail_course, courseId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.courses],
            });
        },
    });
}
