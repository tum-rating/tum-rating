import { Alert } from '@mantine/core';
import { IconDatabaseHeart, IconDatabaseX } from '@tabler/icons-react';
import { ReactElement } from 'react';

import classes from './CollectionDetailsStatusAlert.module.css';

interface CollectionDetailsStatusAlertProps {
    status: boolean;
    message?: ReactElement | string;
    type?: 'error' | 'success';
}

const typeResolver = (type: 'error' | 'success') => {
    switch (type) {
        case 'error':
            return {
                color: 'red',
                icon: <IconDatabaseX />,
            };
        case 'success':
            return {
                color: 'green',
                icon: <IconDatabaseHeart />,
            };
        default:
            return {
                color: 'green',
                icon: <IconDatabaseHeart />,
            };
    }
};

const CollectionDetailsStatusAlert = (props: CollectionDetailsStatusAlertProps) => {
    const { status, message, type = 'success' } = props;
    if (status) {
        return <Alert className={classes.alert} maw="100%" title={message || 'Process status: true, message not provided'} {...typeResolver(type)}></Alert>;
    } else return null;
};

export { CollectionDetailsStatusAlert };
