import {notifications} from "@mantine/notifications";
import {useQuery} from "@tanstack/react-query";

import {endpoints} from "@/api";
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {QUERY_KEY} from "@/constants/queryKeys.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

const getCourseProposal = async (token: string, courseProposalId: string) => {
    const endpoint = endpoints.getSingleProposal(courseProposalId);
    const response = await fetch(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        notifications.show({
            id: courseProposalId,
            title: 'Error',
            message: responseData.message || 'An error occurred',
            autoClose: false,
            withCloseButton: true,
            color: 'red',
            loading: false,
        })
        throw new ResponseError("error", response);
    }

    return responseData;
}


const useCourseProposal = (courseProposalId: string) => {
    const token = userLocalStorage.getUser();
    return useQuery({
        queryKey: [QUERY_KEY["admin_course_proposal_details"], courseProposalId],
        queryFn: async () => getCourseProposal(token, courseProposalId),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export {useCourseProposal}