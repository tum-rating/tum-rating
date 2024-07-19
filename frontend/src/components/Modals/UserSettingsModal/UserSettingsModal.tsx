import {Alert, Button, Container, Divider, Flex, LoadingOverlay, Modal, Text, TextInput, Timeline} from '@mantine/core';
import {useForm} from "@mantine/form";
import {useDisclosure} from "@mantine/hooks";
import {ContextModalProps, modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import {IconAlertTriangle, IconSettings} from "@tabler/icons-react";
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useDeleteUser} from "@/auth/useDeleteUser";
import {useUser} from "@/auth/useUser";
import {UserAvatar} from "@/components/Avatar";
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {CloseButton} from '@/components/Modals/shared/CloseButton';
import {ModalHeader} from '@/components/Modals/shared/ModalHeader';
import {ModalResponsiveContainer} from '@/components/Modals/shared/ModalResponsiveContainer';


interface UserSettingsModalProps extends ContextModalProps {
}

const openUserSettingsModal = ({...props}: UserSettingsModalProps) => {
    modals.openContextModal({
        ...contextModalConfig({modal: 'userSettings'}),
        closeOnClickOutside: true,
        ...props,
    });
};

const UserSettingsModal = ({context, id}: ContextModalProps) => {
    // const {isSuccess, isPending: isLoading, mutate: UserSettings, error, isError} = useUserSettings();
    const [lastStepOfDeletation, setLastStepOfDeletation] = useState(null);
    const navigate = useNavigate();
    const [opened, {toggle}] = useDisclosure();
    const {data: user, isLoading: userLoading} = useUser();
    const {
        mutate: deleteUser,
        isPending: deleteUserLoading,
        isSuccess: deleteUserSuccess,
    } = useDeleteUser();

    useEffect(() => {
        notifications.clean();
    }, []);

    const form = useForm({
        initialValues: {
            email: ''
        },
        validate: {
            email: (value) => {
                if (value !== user?.email) {
                    return "That's a sign. You should not delete your account.";
                }
                return false;
            }
        }
    })

    useEffect(() => {
        if (deleteUserSuccess) {
            navigate('/');
        }
    }, [deleteUserSuccess]);


    return (
        <>
            <Modal p={0} m={0} opened={opened} onClose={toggle} withCloseButton={false} zIndex={9999}>
                <LoadingOverlay visible={userLoading || !user || deleteUserLoading} overlayProps={{radius: 'sm', blur: 2}}/>
                <Flex justify="space-between" align="center">
                    <Text fw="bold">Delete your account</Text>
                    <CloseButton
                        style={{
                            position: 'unset'
                        }}
                        onClick={() => {
                            context.closeModal(id);
                        }}
                    />
                </Flex>

                <Divider my="xs"/>
                <Flex justify="center" align="center" direction="column">
                    <UserAvatar size="xl" my="sm"/>
                    <Text fw="bold">{user?.username}</Text>
                    <Text c="dimmed" fz="sm">{user?.email}</Text>
                </Flex>
                {lastStepOfDeletation ? <>
                        <Text mt="md" fz="sm" fw="bold">To confirm, type "{user?.email}" in the box below</Text>
                        <form onSubmit={form.onSubmit(() => {
                            deleteUser();
                        })}>
                            <TextInput value={form.values.email} my="xs"
                                       data-testid="user-settings-delete-email-input"
                                       onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                                       error={form.errors.email}/>
                            <Button data-testid="user-settings-delete-final-button" loading={deleteUserLoading} color="red" fullWidth type="submit">
                                Delete my account
                            </Button>
                        </form>
                    </>
                    :
                    <>
                        <Alert my="md" icon={<IconAlertTriangle/>} variant="filled" color="orange" radius="md"
                               title="Do you really want to delete your account?"/>

                        <Timeline bulletSize={24} color="gray" active={2}>
                            <Timeline.Item>
                                <Text c="black" size="sm">
                                    This will permanently delete the <Text variant="gradient" fw="bold"
                                                                           span>{user?.username}</Text> account, and all
                                    of your reviews will be removed.
                                </Text>
                            </Timeline.Item>
                            <Timeline.Item>
                                <Text c="black" size="sm">
                                    We will be very sad to see you go, but if you are sure, click the button below.
                                </Text>
                            </Timeline.Item>
                        </Timeline>
                        <Button data-testid="user-settings-delete-confirmation-button" variant="outline" mt="md" fullWidth color="gray"
                                onClick={() => setLastStepOfDeletation(true)}>
                            I understand, delete my account
                        </Button>
                    </>
                }
            </Modal>
            <ModalResponsiveContainer>
                <ModalHeader
                    title="User settings"
                    icon={<IconSettings height={23}/>}
                />

                <CloseButton
                    onClick={() => {
                        context.closeModal(id);
                    }}
                />
                <Container p="sm" mt="sm">
                    <Flex direction="column" gap="sm">
                        <Flex>
                            <UserAvatar size="xl"/>
                            <Flex direction="column" gap="1" ml="sm">
                                <Text data-testid="user-settings-username" fz="md" fw="bold">{user?.username}</Text>
                                <Text data-testid="user-settings-email" fz="sm" c="dimmed">{user?.email}</Text>
                            </Flex>
                        </Flex>

                        <Divider my="sm"/>
                        <Button data-testid="user-settings-delete-button" color="red" onClick={toggle}>Delete account</Button>
                    </Flex>

                </Container>
            </ModalResponsiveContainer>
        </>
    );
};

export {UserSettingsModal, openUserSettingsModal};
