import {Text} from '@mantine/core';
import {useForm} from '@mantine/form';
import {notifications} from '@mantine/notifications';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {useSetUser} from '@/auth/useSetUser.tsx';
import {signInClient} from '@/auth/useSignIn.tsx';

interface UserDataProps {
    user: {
        id: string;
        email: string;
        username: string;
    };
    token: string;
}

export const useOAuthForm = (data: UserDataProps | null, status: string) => {
    const [userData, setUserData] = useState<UserDataProps | null>(null);
    const [unsetUsernameFlag, setUnsetUsernameFlag] = useState(false);
    const navigate = useNavigate();
    const setUserMutation = useSetUser();

    useEffect(() => {
        if (status === 'success' && data) {
            const pattern = /^unset-.*@.*$/;
            if (pattern.test(data.user.username)) {
                setUnsetUsernameFlag(true);
                setUserData(data);
            } else {
                signInClient(data, data.token);
                navigate('/');
            }
        }
    }, [data, status]);

    const form = useForm({
        initialValues: {
            username: '',
        },
        validate: {
            username: (value) => (value.length > 0 ? null : 'Username is required'),
        },
    });

    const handleSubmit = (values: {username: string}) => {
        setUserMutation.mutate({
            username: values.username,
            token: userData?.token,
        });
    };

    useEffect(() => {
        if (setUserMutation.isSuccess && unsetUsernameFlag) {
            navigate('/');
            notifications.show({
                title: 'Success',
                id: 'signin-success',
                message: <Text size="xs">Sign in successful!</Text>,
                color: 'green',
                autoClose: 3000,
            });
        }
    }, [setUserMutation.isSuccess]);

    return {form, handleSubmit, userData, unsetUsernameFlag, setUserMutation};
};
