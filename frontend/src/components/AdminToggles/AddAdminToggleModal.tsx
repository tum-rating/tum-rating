import {Button, Modal, Stack, Switch, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";

import {useAddToggle} from "@/admin/toggles/useAddToggle.tsx";
import {Toggle} from "@/admin/types.ts";

interface AddAdminToggleModalProps {
    opened: boolean;
    close: () => void;
}

const AddAdminToggleModal = (props: AddAdminToggleModalProps) => {
    const {opened, close} = props;
    const {mutate, isPending, isSuccess, error, isError} = useAddToggle();
    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            enabled: false,
        },
    });

    const handleSubmit = (e: Toggle) => {
        mutate(e)
    }

    return (

        <Modal opened={opened} onClose={close} title="Add new toggle">
            <form onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                <Stack>
                    <TextInput {...form.getInputProps('name')} required placeholder="Name" label={"Name"}/>
                    <Textarea {...form.getInputProps('description')} required placeholder="Description"
                              label={"Description"}/>
                    <Switch {...form.getInputProps('enabled')} size="md" onLabel="ON" offLabel="OFF"
                            label={"Initial state"}/>
                    <Button loading={isPending} type="submit">Submit</Button>
                </Stack>
            </form>
        </Modal>
    )
}

export {AddAdminToggleModal}