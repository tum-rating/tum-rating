import {Dialog} from "@mantine/core";
import {ReactNode} from "react";

import {ServerMutationProgressCard} from "./ServerMutationProgressCard.tsx"

interface MutationType {
    mutationType: string;
}

type MutationsType<T extends MutationType> = T;

interface ServerMutationProgressNotificationProps<T extends MutationType> {
    mutations: T[],
    open: boolean,
    mutationInfoRenderer: (mutation: T) => ReactNode
    idKey?: string;
}

const ServerMutationProgressDialog = <T extends MutationType>(
    props: ServerMutationProgressNotificationProps<MutationsType<T>>
) => {
    const {open, idKey = "_id", ...rest} = props
    return (
        <Dialog
            opened={open}
            onClose={() => {
            }}
            title="Server Mutation Progress"
            size="lg"

        >
            <ServerMutationProgressCard {...rest} idKey={idKey}/>
        </Dialog>
    )
}

export {ServerMutationProgressDialog, ServerMutationProgressNotificationProps, MutationType}