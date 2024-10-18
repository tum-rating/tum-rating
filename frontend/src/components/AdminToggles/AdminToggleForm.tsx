import {Alert, Button, Stack, Switch, Text, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {IconFaceIdError} from "@tabler/icons-react";

import {Toggle} from "@/admin/types.ts";
import classes from "@/components/AdminToggles/AdminToggle.module.css";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

interface AdminToggleFormProps {
    initialValues: Toggle;
    onSubmit: (toggle: Toggle) => void;
    isPending: boolean;
    isSuccess: boolean;
    error: any;
}

const AdminToggleForm = (props: AdminToggleFormProps) => {
    const {initialValues, onSubmit, isPending, error} = props;
    const form = useForm({
        initialValues,
    });

    return (
        <form onSubmit={form.onSubmit((values) => {

            onSubmit(values);
            form.reset();
        })}>
            <Stack>
                <TextInput {...form.getInputProps('name')} required placeholder="Name" label={"Name"}/>
                <Textarea {...form.getInputProps('description')} required placeholder="Description"
                          label={"Description"}/>
                <Switch {...form.getInputProps('enabled')}
                        classNames={{
                            label: classes.switchLabel,
                            description: classes.switchDescription,
                            track: classes.switchTrack,
                        }}
                        size="md" onLabel="ON" offLabel="OFF"
                        label={"Initial state"}/>
                {error && (
                    <Alert data-testid="error-message" variant="light" color="red" title="Error"
                           icon={<IconFaceIdError/>} >
                        <Text size="xs">{error instanceof ResponseError ? error?.message : 'An error occurred'}</Text>
                    </Alert>
                )}
                <Button loading={isPending} type="submit">Submit</Button>
            </Stack>
        </form>
    );
}

export {AdminToggleForm}
