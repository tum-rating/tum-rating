import {Flex, Loader, Text} from "@mantine/core";

import {ServerMutationProgressNotificationProps} from "./ServerMutationProgressNotification.tsx"

interface ServerMutationProgressCardProps extends Omit<ServerMutationProgressNotificationProps, "open"> {}

const ServerMutationProgressCard = (props: ServerMutationProgressCardProps) => {
    const {mutations, isPending, isPaused, isSuccess,activeMutation} = props
    return (
        <Flex direction="column">
            {
                mutations.map((mutation) => {
                    return (
                        <Flex gap="xs">
                            {
                                mutation === activeMutation ? (
                                    <Loader size="xs" color="blue"/>
                                ) : (
                                    <Text>wait...</Text>
                                )
                            }
                            {mutation.course}
                        </Flex>
                    )
                })
            }

        </Flex>
    )
}

export {ServerMutationProgressCard}