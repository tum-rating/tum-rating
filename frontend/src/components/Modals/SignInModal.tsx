import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { Anchor, Button, Group, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useSignIn } from '../../auth/useSignIn';
import { ContextModalProps, modals } from '@mantine/modals';

const openSignInModal = () => {
  modals.openContextModal({
    modal: 'signIn',
    title: 'Login',
    innerProps: {},
  });
};
const SignInModal = ({ context, id }: ContextModalProps) => {
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
    const { email, password } = form;
    if (typeof email === 'string' && typeof password === 'string') {
      signIn({
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
        {t('Login')}
      </Text>
      <Text size="lg" weight={500} mb={20}>
        {t('welcomeMessage', { type: t('Login') })}
      </Text>
      <form
        onSubmit={form.onSubmit((e) => {
          onSignIn(e);
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
              // setType(type === 'login' ? 'register' : 'login');
            }}
            size="xs"
          >
            {t('dontHaveAccount')}
          </Anchor>
          <Button type="submit" radius="xl">
            {t('Login')}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export { SignInModal, openSignInModal };
