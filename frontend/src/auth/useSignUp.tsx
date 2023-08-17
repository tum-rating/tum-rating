import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ResponseError } from '../utils/Errors/ResponseError';
import { User } from './useUser';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { endpoints } from '../api';

async function signUp(email: string, password: string, username: string): Promise<boolean> {
  const response = await fetch(endpoints.signup, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, username }),
  });

  console.log(response);
  if (!response.ok) {
    throw new ResponseError('Failed on sign up request', response);
  }

  console.log(response);
  return true; // Return a boolean to indicate successful sign-up
}

type IUseSignUp = UseMutateFunction<
  User,
  unknown,
  {
    email: string;
    password: string;
    username: string;
  },
  unknown
>;

export function useSignUp(): IUseSignUp {
  const navigate = useNavigate();
  const { mutate: signUpMutation } = useMutation<
    boolean,
    ResponseError,
    {
      email: string;
      password: string;
      username: string;
    },
    unknown
  >(({ email, password, username }) => signUp(email, password, username), {
    onSuccess: () => {
      notifications.show({
        id: 'load-data',
        loading: true,
        title: 'Loading',
        message: 'We are sending an email to activate your account...',
        autoClose: false,
        withCloseButton: false,
      });

      setTimeout(() => {
        notifications.update({
          id: 'load-data',
          color: 'teal',
          title: 'Success',
          message: 'Check your email to activate your account!',
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
      }, 2000);

      navigate('/');
    },
    onError: () => {
      notifications.show({
        title: 'Error',
        message: 'Ops.. Error on sign up. Try again!',
        color: 'red',
        icon: <IconX />,
      });
    },
  });

  return signUpMutation;
}
