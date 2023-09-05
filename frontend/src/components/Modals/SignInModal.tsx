import {useTranslation} from 'react-i18next';
import {useForm} from '@mantine/form';
import {Anchor, Button, Group, LoadingOverlay, Paper, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import {useSignIn} from '../../auth/useSignIn';
import {ContextModalProps, modals} from '@mantine/modals';
import {openSignUpModal} from "./SignUpModal";
import {useDisclosure} from "@mantine/hooks";
import {useNavigate} from "react-router-dom";

const openSignInModal = () => {
    modals.openContextModal({
        modal: 'signIn',
        title: 'Login',
        overlayProps: {
            opacity: 0.55,
            blur: 3,
        },
        innerProps: {},
    });
};
const SignInModal = ({context, id}: ContextModalProps) => {
    const navigate = useNavigate()
    const {signIn} = useSignIn();
    const [visible, {open, close}] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'invalidEmail'),
        },
    });

    const {t} = useTranslation();
    return (
        <Paper radius="md" p="xl">
            <LoadingOverlay visible={visible} overlayBlur={2}/>
            <Text size="xl" weight={600}>
                {t('login')}
            </Text>
            <Text size="lg" weight={500} mb={20}>
                {t('welcomeMessage', {type: t('login')})}
            </Text>
            <form
                onSubmit={form.onSubmit((e) => {
                    open()
                    signIn(e)
                        .then(() => {
                            close()
                            navigate("/")
                            context.closeModal(id)
                        })
                        .catch(() => {
                            close()
                        })
                })}
            >
                <Stack>
                    <TextInput
                        required
                        label={t('email')}
                        placeholder={t('email')}
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && t('invalidEmail')}
                        radius="md"
                    />
                    <PasswordInput
                        autoComplete="on"
                        required
                        label={t('password')}
                        placeholder={t('password')}
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && t('passwordRequirements')}
                        radius="md"
                    />
                </Stack>
                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => {
                            openSignUpModal()
                            context.closeModal(id)
                        }}
                        size="xs"
                    >
                        {t('dontHaveAccount')}
                    </Anchor>
                    <Button type="submit" radius="xl">
                        {t('login')}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
};

export {SignInModal, openSignInModal};
