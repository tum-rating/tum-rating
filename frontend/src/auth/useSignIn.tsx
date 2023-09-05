import { useMutation} from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/queryKeys';
import { ResponseError } from '../utils/Errors/ResponseError';
import { User } from './useUser';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { endpoints } from '../api';
import {queryClient} from "../react-query/client";

async function signIn({email,password}:LoginInput): Promise<User> {
  const response = await fetch(endpoints.signin, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log(response)
  if (!response.ok) throw new ResponseError('Failed on sign in request', response);
  return await response.json();
}

export type LoginInput = {
  email: string;
  password: string;
}


export function useSignIn(): { signIn: any, isSuccess: boolean } {
  const {mutateAsync: signInMutation, isSuccess} = useMutation({
    mutationFn: async ({email, password}: LoginInput) => await signIn({email, password}),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data);
      notifications.show({
        message: 'Sign in successful!',
        color: 'green',
        icon: <IconCheck/>,
      });
    },
    onError: (error) => {
      console.log(error)
      const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
      notifications.show({
        message: errorMessage,
        color: 'red',
        icon: <IconX/>,
      });
    },
  })
  return {signIn: signInMutation, isSuccess}
}



