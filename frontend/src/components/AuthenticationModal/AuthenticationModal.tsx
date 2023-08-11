import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {upperFirst} from '@mantine/hooks';
import {useForm} from '@mantine/form';
import {
    Anchor,
    Button,
    Checkbox,
    Group,
    Paper,
    PaperProps,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import {useSignIn} from "../../auth/useSignIn.tsx";
import {useSignUp} from "../../auth/useSignUp.tsx";

type AuthenticationModalProps = {
    defaultType: 'login' | 'register';
} & PaperProps;

const AuthenticationModal = ({defaultType, ...props}: AuthenticationModalProps) => {
    const [type, setType] = useState(defaultType);
    const signIn = useSignIn();
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
    const onSignIn = (form) => {
        const {email, password} = form;
        if (typeof email === 'string' && typeof password === 'string') {
            signIn({
                email,
                password
            });
        }
    }
    const signUp = useSignUp();

    const onSignUp = (form) => {
        const {email, password, username} = form;
        if (typeof email === 'string' && typeof password === 'string' && typeof username === 'string') {
            signUp({
                username,
                email,
                password
            });
        }
    }

    const {t} = useTranslation();

    return (
        <Paper radius="md" p="xl" {...props}>
            <Text size="xl" weight={600}>
                {t(type)}
            </Text>
            <Text size="lg" weight={500} mb={20}>
                {t('welcomeMessage', {type: t(upperFirst(type))})}
            </Text>
            <form
                onSubmit={form.onSubmit((e) => {
                    if (type === "register") {
                        onSignUp(e)
                    } else {
                        onSignIn(e)
                    }
                })}
            >
                <Stack>
                    {type === 'register' && (
                        <TextInput
                            label={t('username')}
                            placeholder={t('username')}
                            value={form.values.username}
                            onChange={(event) =>
                                form.setFieldValue('username', event.currentTarget.value)
                            }
                            radius="md"
                        />
                    )}
                    <TextInput
                        required
                        label={t('email')}
                        placeholder={t('email')}
                        value={form.values.email}
                        onChange={(event) =>
                            form.setFieldValue('email', event.currentTarget.value)
                        }
                        error={form.errors.email && t('invalidEmail')}
                        radius="md"
                    />
                    <PasswordInput
                        required
                        label={t('password')}
                        placeholder={t('password')}
                        value={form.values.password}
                        onChange={(event) =>
                            form.setFieldValue('password', event.currentTarget.value)
                        }
                        error={
                            form.errors.password && t('passwordRequirements')
                        }
                        radius="md"
                    />
                    {type === 'register' && (
                        <Checkbox
                            label={t('acceptTerms')}
                            checked={form.values.terms}
                            onChange={(event) =>
                                form.setFieldValue('terms', event.currentTarget.checked)
                            }
                        />
                    )}
                </Stack>
                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => {
                            setType(type === 'login' ? 'register' : 'login');
                        }}
                        size="xs"
                    >
                        {type === 'register'
                            ? t('alreadyHaveAccount')
                            : t('dontHaveAccount')}
                    </Anchor>
                    <Button type="submit" radius="xl">
                        {t(type)}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
};

export {AuthenticationModal};
