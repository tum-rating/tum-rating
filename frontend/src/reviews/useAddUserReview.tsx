import {useMutation} from '@tanstack/react-query';
import {endpoints} from '../api';
import {ResponseError} from "../utils/Errors/ResponseError";
import {User} from "../auth/useUser";
import * as userLocalStorage from "../auth/user.localstore";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import {queryClient} from "../react-query/client";

async function addUserReview(user: User | null | undefined, userReview: UserAddReviewInput, courseId: string): Promise<string | null> {
    if (!user) return null;
    const body = {...userReview}
    const response = await fetch(endpoints.reviews + "/" + courseId + "/user/" + user.user.id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new ResponseError('Failed on add review request', response);
    return await response.json();
}

export interface UserAddReviewInput {
    howInterestingRating: number,
    howEasyRating: number,
    comment: string,
}

export function useAddUserReview(courseId: string): any {
    const user = userLocalStorage.getUser()
    const {mutateAsync: addUserReviewMutation,status} = useMutation({
        mutationFn: async (newReview: UserAddReviewInput) => addUserReview(user, newReview, courseId),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Course added!',
                color: 'green',
                icon: <IconCheck/>,
            });
            console.log(courseId)
            queryClient.invalidateQueries(['detailReview'])
        }
    })
    return {addUserReview:addUserReviewMutation,status}
}