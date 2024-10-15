import {Badge, Button, Divider, Flex, Stack, Text, TextInput} from '@mantine/core';
import {IconEditCircle, IconHammer, IconHammerOff, IconTrashX} from '@tabler/icons-react';
import {MRT_Row} from 'mantine-react-table';
import {HTMLAttributes, useEffect, useState} from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import {User} from '@/admin/types.ts';
import {useBanUser} from '@/admin/users/useBanUser.tsx';
import {useRemoveUser} from '@/admin/users/useRemoveUser.tsx';
import {useUser} from '@/admin/users/useUser.ts';
import {useUser as useLoggedUser} from '@/auth/useUser.tsx';
import {CollectionDetailsReviewsSection} from "@/components/AdminTable/Shared/CollectionDetailsReviewsSection";
import {CollectionDetailsStatusAlert} from '@/components/AdminTable/Shared/CollectionDetailsStatusAlert';
import {UserAvatar} from '@/components/Avatar';
import {Skeleton} from '@/components/Skeleton';
import {getPath, Paths} from '@/routes/paths.ts';

interface UserExpansionProps extends HTMLAttributes<HTMLElement> {
    userId: string;
    row?: MRT_Row<User>;
}

const UserExpansion = ({userId, row, ...rest}: UserExpansionProps) => {
    const {data: userDetails, isLoading, error, isError, refetch} = useUser(userId);
    const [user, setUser] = useState(userDetails);
    const [editing, setEditing] = useState(false);
    const {data: loggedUser} = useLoggedUser();
    const {mutate: changeBanStatus, isLoading: banLoading} = useBanUser();
    const {mutate: removeUser, isLoading: userRemoveLoading, isSuccess: removesUserIsSuccess} = useRemoveUser();
    const [statusAlertFlag, setStatusAlertFlag] = useState(false);

    useEffect(() => {
        setStatusAlertFlag(isError || removesUserIsSuccess);
    }, [isError || removesUserIsSuccess]);

    return (
        <Flex w="100%" wrap={{base: 'wrap', sm: 'nowrap'}} className={classes.expansionContainer} gap="md" {...rest}>
            {statusAlertFlag ? (
                <Flex justify="center" w="100%" direction="column" gap="lg">
                    <CollectionDetailsStatusAlert status={isError} message={error?.message} type="error" />
                    <CollectionDetailsStatusAlert status={removesUserIsSuccess} message="Course removed" type="success" />
                    {isError && (
                        <Button
                            variant="subtle"
                            onClick={() => {
                                refetch();
                            }}
                        >
                            Refetch
                        </Button>
                    )}
                </Flex>
            ) : (
                <>
                    <Flex direction="column" gap="xs" className={classes.expansionDetails}>
                        <Flex align="center" gap="xs" wrap="wrap">
                            <Text fz="sm" fw={500}>
                                Details
                            </Text>
                        </Flex>
                        <Divider variant="dashed" size="sm" />
                        <Flex align="center" gap="3">
                            <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
                                User ID:{' '}
                            </Text>
                            <Skeleton
                                width={155}
                                height={16}
                                radius="sm"
                                loading={isLoading}
                                component={
                                    <Button
                                        px={4}
                                        m={0}
                                        h={20}
                                        variant="subtle"
                                        fz="xs"
                                        fw="600"
                                        c={'blue'}
                                        onClick={() => {
                                            const dynamicPath = getPath(Paths.adminUserDetails).replace(':userId', userId);
                                            window.open(dynamicPath, '_blank');
                                        }}
                                    >
                                        {userId}
                                    </Button>
                                }
                            ></Skeleton>
                        </Flex>
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
                </>
            )}
            <CollectionDetailsReviewsSection userId={userId} />
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
                            disabled={userDetails?.id === String(loggedUser?.id) || statusAlertFlag}
                            leftSection={<IconHammerOff size={16} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                changeBanStatus({userId: userDetails?.id, flag: false});
                            }}
                        >
                            Unban
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            color="black"
                            loading={banLoading || isLoading}
                            disabled={userDetails?.id === String(loggedUser?.id) || statusAlertFlag}
                            leftSection={<IconHammer size={16} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                changeBanStatus({userId: userDetails?.id, flag: true});
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
                                row && row.toggleExpanded();
                            }
                        }}
                        disabled={userDetails?.id === String(loggedUser?.id) || statusAlertFlag}
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
        </Flex>
    );
};

export {UserExpansion};
