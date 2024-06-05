import { Alert, Button } from '@mantine/core';
import { IconDatabaseHeart, IconDatabaseX } from '@tabler/icons-react';

interface CollectionDetailsStatusAlertProps {
    isError: boolean;
    errorMessage: string;
    isSuccess: boolean;
    successMessage: string;
    refetch: () => void;
}

const CollectionDetailsStatusAlert = (props: CollectionDetailsStatusAlertProps) => {
    const { isError, errorMessage, isSuccess, successMessage, refetch } = props;

    if (isError) {
        return (
            <>
                <Alert variant="light" color="red" title="Error" icon={<IconDatabaseX />}>
                    {errorMessage || 'Process failed, message not provided'}
                    <Button variant={'white'} c="black" onClick={refetch}>
                        Refetch
                    </Button>
                </Alert>
            </>
        );
    }

    if (isSuccess) {
        return (
            <>
                <Alert variant="light" color="green" title="Success" icon={<IconDatabaseHeart />}>
                    {successMessage || 'Process succeeded, message not provided'}
                </Alert>
            </>
        );
    }
    return null;
};

export { CollectionDetailsStatusAlert };
