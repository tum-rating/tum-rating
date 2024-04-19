import {Badge, Button, Flex, HoverCard, Stack, Text} from "@mantine/core";
import {ReactNode} from "react";

import {User} from "@/admin/types.ts";
import {useBanUser} from "@/admin/useBanUser.tsx";
import {useUser} from "@/admin/useUser.ts";
import {UserAvatar} from "@/components/Avatar";
import {Skeleton} from "@/components/Skeleton";

interface UserInfoActionProps {
    userId: string;
    children: (user: User | undefined) => ReactNode;
}

const UserInfoAction = (props: UserInfoActionProps) => {
    const {userId, children} = props;
    const {mutate: banUser} = useBanUser();
    const {data: user, isLoading} = useUser(userId);
    return (
        <HoverCard width={280} shadow="md">
            <HoverCard.Target>
                {children(user)}
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Flex gap="sm">
                    <Skeleton width={120} height={120} radius={120} mx="auto" loading={isLoading} component={
                        <UserAvatar/>
                    }/>
                    <Flex direction="column" align="flex-start" gap={0}>
                        <Skeleton w={100} h={10} loading={isLoading} component={
                            <Text ta="center" fz="xs" fw={600}
                                  style={user?.isBanned ? {textDecorationLine: 'line-through'} : {}}
                            >
                                {user?.username}
                            </Text>
                        }/>
                        <Skeleton w={100} h={25} loading={isLoading} component={
                            <Text mb="xs" ta="center" fz="xs" fw={500}
                                  c={user?.isBanned ? "gray" : "dimmed"}
                                  style={user?.isBanned ? {textDecorationLine: 'line-through'} : {}}
                            >
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
                <Stack gap="4">
                    <Button size="xs" loading={isLoading} variant="default" fullWidth mt="md" onClick={() =>{
                        //TODO navigate to user details, url or something else
                    }}>
                        Details
                    </Button>
                    {user?.isBanned ?
                        <Button
                            fullWidth
                            size="xs"
                            color="red"
                            onClick={() => {
                                banUser({userId: user.id, flag: false});
                            }}
                        >
                            Unban
                        </Button>:
                        <Button
                            fullWidth
                            size="xs"
                            color="red"
                            onClick={() => {
                                banUser({userId: user.id, flag: true});
                            }}
                        >
                            Ban
                        </Button>
                    }
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}

export {UserInfoAction};
