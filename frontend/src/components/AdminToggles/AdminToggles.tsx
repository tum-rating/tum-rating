import {ActionIcon, Box, Card, Divider, Flex, Menu, rem, ScrollArea, Switch, Text, Title} from "@mantine/core"
import {useForm} from "@mantine/form";
import {useEffect, useState} from "react";

import classes from "./AdminToggle.module.css"

import {useSetToggle} from "@/admin/toggles/useSetToggle.tsx";
import {useToggles} from "@/admin/toggles/useToggles.tsx";
import {AdminToggleControls} from "@/components/AdminToggles/AdminToggleControls.tsx";
import {IconDotsVertical, IconEdit, IconX} from "@tabler/icons-react";
import {EditAdminToggleModal} from "@/components/AdminToggles/EditAdminToggleModal.tsx";
import {useDisclosure} from "@mantine/hooks";
import {Toggle} from "@/admin/types.ts";
import {useRemoveToggle} from "@/admin/toggles/useRemoveToggle.tsx";

const AdminToggles = () => {
    const {data: toggles, isLoading: togglesLoading} = useToggles();
    const {mutate: removeToggle, isPending: toggleRemovePending} = useRemoveToggle();
    const [opened, {open, close}] = useDisclosure(false);
    const [selectedToggle, setSelectedToggle] = useState<Toggle | null>(null);
    const {mutate: setToggle, isPending: toggleSetPending} = useSetToggle();

    const form = useForm({
        initialValues: {},
    });

    useEffect(() => {
        if (!togglesLoading && toggles) {
            form.setValues(Object.fromEntries(toggles.map((toggle) => [toggle.name, toggle.enabled])));
        }
    }, [toggles, togglesLoading]);

    const handleEditToggle = (toggle: Toggle) => {
        setSelectedToggle(toggle);
        open();
    };

    return (
        <Flex direction='column' mt="32" className={classes.mainContainer}>
            <Flex w='100%'>
                <Box className={classes.titleContainer}>
                    <Title order={4}>
                        Admin Toggles
                    </Title>
                    <Text fz='sm' c='dimmed'>
                        Configuration of application environment toggles.
                    </Text>
                </Box>
                <AdminToggleControls isLoading={togglesLoading || toggleSetPending || toggleRemovePending}/>
            </Flex>
            <Card shadow={'lg'} w={'100%'} p={0} mt='lg'>
                {toggles && toggles.length ? (
                    <ScrollArea.Autosize>
                        <form>
                            <Flex justify={'center'} direction={'column'}>
                                {toggles.map((toggle, index) => (
                                    <>
                                        <Flex align='center'>
                                            <Switch
                                                {...form.getInputProps(toggle.name)}
                                                labelPosition={'left'}
                                                width={'100%'}
                                                description={toggle.description}
                                                checked={toggle.enabled}
                                                label={toggle.name}
                                                onLabel="ON" offLabel="OFF"
                                                onClick={() => setToggle({
                                                    ...toggle,
                                                    enabled: !toggle.enabled
                                                })}
                                                classNames={{
                                                    labelWrapper: classes.switchLabelWrapper,
                                                    body: classes.switchBody,
                                                    root: classes.switchRoot,
                                                    track: classes.switchTrack
                                                }}
                                            />
                                            <Menu>
                                                <Menu.Target>
                                                    <ActionIcon size='sm' variant='subtle' mr='md'>
                                                        <IconDotsVertical/>
                                                    </ActionIcon>
                                                </Menu.Target>

                                                <Menu.Dropdown>
                                                    <Menu.Item
                                                        onClick={() => removeToggle(toggle.id)}
                                                        leftSection={<IconX
                                                            style={{width: rem(14), height: rem(14)}}/>}
                                                        color='red'
                                                    >
                                                        Remove toggle
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        leftSection={<IconEdit
                                                            style={{width: rem(14), height: rem(14)}}/>}
                                                        onClick={() => handleEditToggle(toggle)}
                                                    >
                                                        Edit toggle
                                                    </Menu.Item>
                                                </Menu.Dropdown>
                                            </Menu>
                                        </Flex>
                                        {index !== toggles.length - 1 && <Divider/>}
                                    </>
                                ))}
                            </Flex>
                        </form>
                    </ScrollArea.Autosize>
                ) : !togglesLoading ? (
                    <Flex justify={'center'} align={'center'} p={'lg'}>
                        <Text fz='md' c='dimmed' fw={500}>
                            No toggles found
                        </Text>
                    </Flex>
                ) : null}
            </Card>
            {selectedToggle && (
                <EditAdminToggleModal opened={opened} close={() => {
                    setSelectedToggle(null)
                    close()
                }} toggle={selectedToggle}/>
            )}
        </Flex>
    )
}

export {AdminToggles}