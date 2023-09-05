import {useTranslation} from 'react-i18next';
import {useForm} from '@mantine/form';
import {
    Anchor,
    Button,
    Checkbox,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core';
import {useSignUp} from '../../auth/useSignUp';
import {ContextModalProps, modals} from '@mantine/modals';
import {useDisclosure} from "@mantine/hooks";
import {IconMail} from '@tabler/icons-react';
import {openSignInModal} from "./SignInModal";

const openSignUpModal = () => {
    modals.openContextModal({
        modal: 'signUp',
        title: 'Register',
        overlayProps: {
            opacity: 0.55,
            blur: 3,
        },
        closeOnClickOutside: false,
        innerProps: {},
    });
};

const SignUpModal = ({context, id}: ContextModalProps) => {
    const {isSuccess, signUp} = useSignUp();
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
            {isSuccess ? (
                <Flex direction='column' align='center' gap={25}>
                    <Group>
                        <ThemeIcon size="100px" radius={50} variant="gradient"
                                   gradient={{from: 'teal', to: 'lime', deg: 105}}>
                            <IconMail size={75}/>
                        </ThemeIcon>
                    </Group>
                    <Text
                        size="xl"
                        fw={900}
                        variant="gradient"
                        gradient={{from: 'teal', to: 'lime', deg: 105}}
                    >Check Your Email </Text>
                    <Text fw={500} px={30} align='center'>
                        Please check you email
                        <Text
                            component='span'
                            fw={900}
                            variant="gradient"
                            gradient={{from: 'teal', to: 'lime', deg: 105}}
                        > {form.values.email} </Text>
                        for instructions to activate your account.
                    </Text>
                    <Button variant='outlined'>Resend email</Button>
                </Flex>
            ) : (
                <>
                    <Text size="xl" weight={600}>
                        {t('register')}
                    </Text>
                    <Text size="lg" weight={500} mb={20}>
                        {t('welcomeMessage', {type: t('register')})}
                    </Text>
                    <form
                        onSubmit={form.onSubmit((e) => {
                            open()
                            signUp(e)
                                .then(() => {
                                    close()
                                })
                                .catch(() => {
                                    close()
                                })
                        })}
                    >
                        <Stack>
                            <TextInput
                                label={"username"}
                                placeholder={"username"}
                                value={form.values.username}
                                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                                radius="md"
                            />
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
                            <Checkbox
                                label={t('acceptTerms')}
                                checked={form.values.terms}
                                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                            />
                        </Stack>
                        <Group position="apart" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={() => {
                                    openSignInModal()
                                    context.closeModal(id)
                                }}
                                size="xs"
                            >
                                {t('alreadyHaveAccount')}
                            </Anchor>
                            <Button type="submit" radius="xl">
                                {t('register')}
                            </Button>
                        </Group>
                    </form>
                </>
            )}

        </Paper>
    );
};

export {SignUpModal, openSignUpModal};
