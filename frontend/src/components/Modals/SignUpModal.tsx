import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { Anchor, Button, Checkbox, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useSignUp } from '../../auth/useSignUp';
import { ContextModalProps, modals } from '@mantine/modals';

const openSignUpModal = () => {
  modals.openContextModal({
    modal: 'signUp',
    title: 'Register',
    innerProps: {},
  });
};

const SignUpModal = ({ context, id }: ContextModalProps) => {
  const signUp = useSignUp();
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

  const onSignUp = (form) => {
    const { email, password, username } = form;
    if (typeof email === 'string' && typeof password === 'string' && typeof username === 'string') {
      signUp({
        username,
        email,
        password,
      });
      context.closeModal(id);
    }
  };

  const { t } = useTranslation();

  return (
    <Paper radius="md" p="xl">
      <Text size="xl" weight={600}>
        {t('Register')}
      </Text>
      <Text size="lg" weight={500} mb={20}>
        {t('welcomeMessage', { type: t('Register') })}
      </Text>
      <form
        onSubmit={form.onSubmit((e) => {
          onSignUp(e);
        })}
      >
        <Stack>
          <TextInput
            label={t('username')}
            placeholder={t('username')}
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
              // setType(type === 'login' ? 'register' : 'login');
            }}
            size="xs"
          >
            {t('alreadyHaveAccount')}
          </Anchor>
          <Button type="submit" radius="xl">
            {t('Register')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export { SignUpModal, openSignUpModal };
