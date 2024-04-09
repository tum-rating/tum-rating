import {Dialog} from "@mantine/core";

import {ServerMutationProgressCard} from "./ServerMutationProgressCard.tsx"

import {CourseProposal} from "@/admin/types.ts";

interface ServerMutationProgressNotificationProps {
    mutations: CourseProposal[],
    isPending: boolean,
    isPaused: boolean,
    isSuccess: boolean,
    open: boolean,
    activeMutation: CourseProposal,
}

const ServerMutationProgressNotification = (props: ServerMutationProgressNotificationProps) => {
    const {open, ...rest} = props

    return (
        <Dialog
            opened={open}
            onClose={() => {}}
            title="Server Mutation Progress"
            size="md"
        >
            <ServerMutationProgressCard {...rest}/>
        </Dialog>
    )
}

export {ServerMutationProgressNotification, ServerMutationProgressNotificationProps}