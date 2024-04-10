import {Flex, Loader, Text} from "@mantine/core";
import {MutationStatus, useMutationState} from "@tanstack/react-query";

import {MutationType, ServerMutationProgressNotificationProps} from "./ServerMutationProgressDialog.tsx";

interface ServerMutationProgressCardProps<T extends MutationType> extends Omit<ServerMutationProgressNotificationProps<T>, "open"> {
}



const ServerMutationProgressCard = <T extends MutationType>(
    props: ServerMutationProgressCardProps<T>
) => {
    const {mutations, mutationInfoRenderer, idKey} = props;
    const variables = useMutationState()

    return (
        <Flex direction="column" gap="xs">
            {variables.map((element, index) => {
                const mutation = mutations.find(x=>x[idKey] === element.variables)
                if(mutation){
                    return (
                        <Flex key={index} gap="xs">
                            {/* Render mutation info here */}
                            {/*<ServerMutationProgressCardStatus status={activeMutation.variables === activeMutation.status}/>*/}
                            <ServerMutationProgressCardStatus status={element.status}/>
                            {mutationInfoRenderer(mutation)}
                        </Flex>
                    )
                }
                return null;
            })}
        </Flex>
    );
};

const ServerMutationProgressCardStatus = ({status}: { status: MutationStatus }) => {
    switch (status) {
        case "idle":
            return <Text c="gray">Idle</Text>;
        case "pending":
            return <Loader size="xs"/>;
        case "success":
            return <Text c="green">Success</Text>;
        case "error":
            return <Text c="red">Error</Text>;
        default:
            return <Text c="gray">Queued</Text>;
    }
}

export {ServerMutationProgressCard};
