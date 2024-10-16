import {Alert, Button, Stack, Switch, Text, Textarea, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {Toggle} from "@/admin/types.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";
import {IconFaceIdError} from "@tabler/icons-react";

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
                <Switch {...form.getInputProps('enabled')} size="md" onLabel="ON" offLabel="OFF"
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
