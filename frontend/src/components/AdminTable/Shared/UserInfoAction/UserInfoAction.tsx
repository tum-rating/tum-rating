import {Badge, Button, Flex, HoverCard, Text} from "@mantine/core";
import {PropsWithChildren} from "react";
import {useNavigate} from "react-router-dom";

import {useUser} from "@/admin/useUser.ts";
import {UserAvatar} from "@/components/Avatar";
import {Skeleton} from "@/components/Skeleton";


interface UserInfoActionProps extends PropsWithChildren {
    userId: string;
}

const UserInfoAction = (props: UserInfoActionProps) => {
    const navigate = useNavigate();
    const {userId, children} = props;
    const {data: user, isLoading} = useUser(userId);
    return (
        <HoverCard width={280} shadow="md">
            <HoverCard.Target>
                {children}
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Flex gap="sm">
                    <Skeleton width={120} height={120} radius={120} mx="auto" loading={isLoading} component={
                        <UserAvatar/>
                    }/>
                    <Flex direction="column" align="flex-start" gap={0}>
                        <Skeleton w={100} h={10} loading={isLoading} component={
                            <Text ta="center" fz="xs" fw={500} >
                                {user?.username}
                            </Text>
                        }/>
                        <Skeleton w={100} h={25} loading={isLoading} component={
                            <Text mb="xs" ta="center" fz="xs" fw={500}  c="dimmed">
                                {user?.email}
                            </Text>
                        }/>
                        <Flex gap={3}>
                            {user?.isBanned &&
                                <Badge variant="filled" color="red">Banned</Badge>
                            }
                            <Badge
                                color={user?.role === 1 ? "gold" : "blue"}>{user?.role === 1 ? "admin" : "user"}</Badge>
                        </Flex>
                    </Flex>
                </Flex>
                <Button loading={isLoading} variant="default" fullWidth mt="md" onClick={() => navigate("/")}>
                    Details
                </Button>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}

export {UserInfoAction};
