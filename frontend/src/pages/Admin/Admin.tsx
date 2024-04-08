import {Badge, Flex,  Skeleton, Text} from "@mantine/core";

import {useAllUsers} from "@/admin/useAllUsers.ts";
import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";

const Admin = () => {
    const {data:proposals, isFetching: isCoursesProposalsFetching} = useCoursesProposals();
    const {data:users, isFetching: isUsersFetching} = useAllUsers();
    return (
        <Flex direction="column">
            <h2>Admin Page</h2>
            <Flex direction="column" gap="xs">
                <Flex gap="xs">
                    <Text>Active Proposals: </Text>
                    {isCoursesProposalsFetching ? (
                        <Skeleton width={30} height={20}/>
                    ) : <Badge>{proposals?.length}</Badge>}

                </Flex>   
                <Flex gap="xs">
                    <Text>Active Users: </Text>
                    {isUsersFetching ? (
                        <Skeleton width={30} height={20}/>
                    ) : <Badge>{users?.users.length}</Badge>}
                </Flex>
            </Flex>
        </Flex>
    );
}

export {Admin};