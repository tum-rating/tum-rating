import { useMutation, useQueryClient} from '@tanstack/react-query';
import { endpoints } from '../api';
import { QUERY_KEY } from '../constants/queryKeys';
import {ResponseError} from "../utils/Errors/ResponseError";
import {User} from "../auth/useUser";
import * as userLocalStorage from "../auth/user.localstore";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";


async function addReview(user: User | null | undefined,newReview:ReviewInput): Promise<string | null> {
    if (!user) return null;
    const response = await fetch(endpoints.reviews, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newReview),
    });
    if (!response.ok) throw new ResponseError('Failed on add review request', response);

    return await response.json();
}

export interface ReviewInput {
    courseId: string;
    courseNumber: string;
    professor: string;
    course: string;
}

export function useAddReview(): any {
    const user = userLocalStorage.getUser()
    const queryClient = useQueryClient()

    const {mutateAsync: addReviewMutation,status} = useMutation({
        mutationFn: async (newReview: ReviewInput) => addReview(user,newReview),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Course added!',
                color: 'green',
                icon: <IconCheck/>,
            });
            queryClient.invalidateQueries([QUERY_KEY.reviews])
        }
    })

    return {addReview:addReviewMutation,status}
}