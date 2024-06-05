import { useState, useEffect } from 'react';

interface OperationStatus {
    isError: boolean;
    errorMessage: string;
    isSuccess: boolean;
    successMessage: string;
    refetch: () => void;
}

const useOperationStatus = (operations: OperationStatus[]) => {
    const [operationStatus, setOperationStatus] = useState<OperationStatus>({
        isError: false,
        errorMessage: '',
        isSuccess: false,
        successMessage: '',
        refetch: async () => {},
    });

    useEffect(() => {
        operations.forEach((operation) => {
            if (operation.isError) {
                setOperationStatus(operation);
            } else if (operation.isSuccess) {
                setOperationStatus(operation);
            }
        });
    }, [operations]);

    return operationStatus;
};

export { useOperationStatus };