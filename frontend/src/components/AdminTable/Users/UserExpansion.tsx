import { Alert, Badge, Button, Center, Divider, Flex, Stack, Text, TextInput } from '@mantine/core';
import { IconDatabaseX, IconEditCircle, IconHammer, IconHammerOff, IconTrashX } from '@tabler/icons-react';
import {MRT_Row} from "mantine-react-table";
import { useState } from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import { User} from '@/admin/types.ts';
import { useBanUser } from '@/admin/useBanUser.tsx';
import { useRemoveUser } from '@/admin/useRemoveUser.tsx';
import { useUser } from '@/admin/useUser.ts';
import { UserAvatar } from '@/components/Avatar';
import { Skeleton } from '@/components/Skeleton';

interface UserExpansionProps {
    user: User;
    row: MRT_Row<User>
}

const UserExpansion = ({ user: IUser, row }: UserExpansionProps) => {
    const { data: userDetails, isLoading, error, isError, refetch } = useUser(IUser.id);
    const [user, setUser] = useState(userDetails);
    const [editing, setEditing] = useState(false);
    const { mutate: changeBanStatus, isLoading: banLoading } = useBanUser();
    const { mutate: removeUser, isLoading: userRemoveLoading } = useRemoveUser();
    return (
        <Flex w="100%" wrap={{ base: 'wrap', sm: 'nowrap' }} className={classes.expansionContainer} gap="md">
            {isError ? (
                <Center h={270}>
                    <Flex direction="column">
                        <Text fw={600}>Error occurred - {IUser.id}</Text>
                        <Alert variant="light" color="red" title="Alert title" icon={<IconDatabaseX height={120} width={120} />}>
                            {error?.message || 'An error occurred while fetching the data - error message not provided'}
                        </Alert>
                        <Button
                            variant={'white'}
                            c="black"
                            onClick={() => {
                                refetch();
                            }}
                        >
                            Refetch
                        </Button>
                    </Flex>
                </Center>
            ) : (
                <>
                    <Flex direction="column" gap="xs" className={classes.expansionDetails}>
                        <Flex align="center" gap="xs" wrap="wrap">
                            <Text fz="sm" fw={500}>
                                Details
                            </Text>
                        </Flex>
                        <Divider variant="dashed" size="sm" />
                        <Flex gap="xs" mb="xs">
                            <Skeleton width={52} height={20} radius="lg" loading={isLoading} component={userDetails?.role === 1 ? <Badge color="gold">Admin</Badge> : <Badge color="blue">User</Badge>}></Skeleton>
                            <Skeleton width={125} height={20} radius="lg" loading={isLoading} component={userDetails?.isBanned ? <Badge color="red">Banned</Badge> : null}></Skeleton>
                            <Skeleton width={125} height={20} radius="lg" loading={isLoading} component={userDetails?.isEmailActivated ? <Badge color="green">Email activated</Badge> : <Badge color="gray">Email not activated</Badge>}></Skeleton>
                        </Flex>
                        <Flex gap="lg">
                            <Skeleton width={84} height={84} radius="lg" loading={isLoading} component={<UserAvatar size="xl" />}></Skeleton>
                            <Flex direction="column" gap="xs">
                                <Skeleton
                                    width={221}
                                    height={36}
                                    radius="sm"
                                    mt={22}
                                    loading={isLoading}
                                    component={
                                        <TextInput
                                            disabled={!editing}
                                            value={userDetails?.email}
                                            label="Email"
                                            placeholder="Enter user email"
                                            onChange={(event) =>
                                                setUser({
                                                    ...user,
                                                    email: event.currentTarget.value,
                                                })
                                            }
                                        />
                                    }
                                ></Skeleton>
                                <Skeleton
                                    width={221}
                                    height={36}
                                    radius="sm"
                                    mt={22}
                                    loading={isLoading}
                                    component={
                                        <TextInput
                                            disabled={!editing}
                                            value={userDetails?.username}
                                            label="Username"
                                            placeholder="Enter user username"
                                            onChange={(event) =>
                                                setUser({
                                                    ...user,
                                                    username: event.currentTarget.value,
                                                })
                                            }
                                        />
                                    }
                                ></Skeleton>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex direction="column" gap="xs" className={classes.expansionActions}>
                        <Flex align="center" gap="xs">
                            <Text fz="sm" fw={500}>
                                Actions
                            </Text>
                        </Flex>
                        <Stack gap="xs">
                            <Divider variant="dashed" size="sm" />
                            {userDetails?.isBanned ? (
                                <Button
                                    size="sm"
                                    color="black"
                                    loading={banLoading || isLoading}
                                    leftSection={<IconHammerOff size={16} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        changeBanStatus({ userId: userDetails?.id, flag: false });
                                    }}
                                >
                                    Unban
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    color="black"
                                    loading={banLoading || isLoading}
                                    leftSection={<IconHammer size={16} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        changeBanStatus({ userId: userDetails?.id, flag: true });
                                    }}
                                >
                                    Ban
                                </Button>
                            )}
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    try {
                                        removeUser(userDetails?.id);
                                    } catch (e) {

                                    } finally {
                                        row.toggleExpanded();
                                    }
                                }}
                                loading={userRemoveLoading || isLoading || banLoading}
                                leftSection={<IconTrashX width={16} />}
                                color="red"
                            >
                                Remove User
                            </Button>
                            <Button
                                color="green"
                                disabled
                                leftSection={<IconEditCircle width={16} />}
                                onClick={() => {
                                    if (editing) {
                                        setEditing(false);
                                    } else {
                                        setEditing(true);
                                    }
                                }}
                                variant="default"
                            >
                                {!editing ? 'Edit User' : 'Save User'}
                            </Button>
                        </Stack>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export { UserExpansion };
