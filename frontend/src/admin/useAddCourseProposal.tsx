import {Text} from "@mantine/core";
import {notifications} from "@mantine/notifications";

import {ReadyCourseProposal} from "@/admin/types.ts";
import {endpoints, useMutationWithAuth} from "@/api";
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {QUERY_KEY} from "@/constants/queryKeys.ts";
import {queryClient} from "@/react-query/client.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

const addCourseProposal = async (token:string,courseProposal: ReadyCourseProposal) => {
    if(!token){
        return null;
    }
    const endpoint = endpoints.addCourse;
    const response = await fetch(endpoint,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseProposal),
    });
    const responseData = await response.json();
    if (!response.ok) {
        notifications.update({
            id: courseProposal.courseId,
            title: 'Accepting proposal - error',
            message: <Text size="xs">Failed to accept proposal: {responseData.message}</Text>,
            autoClose: false,
            withCloseButton: true,
            color: 'red',
            loading: false,
        });
        throw new ResponseError('error', response);
    }
    return courseProposal;
}


const useAddCourseProposal = () => {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: (courseProposal: ReadyCourseProposal) => addCourseProposal(token,courseProposal),
        onMutate: (variables) => {
            notifications.show({
                id: variables.courseId,
                autoClose: false,
                title: 'Accepting proposal',
                message: <Text size="xs">Your proposal is being accepted</Text>,
                loading: true,
                withCloseButton: false,
            });

            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.proposals],
            });
            notifications.update({
                id: variables.courseId,
                title: 'Success',
                message: <Text size="xs">Proposal accepted</Text>,
                autoClose: 3000,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    })
}

export {useAddCourseProposal}

