import {IconInfoHexagon} from "@tabler/icons-react";

import {useSignOutProps} from "@/auth/useSignOut.tsx";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

interface handleAuthErrorsProps {
    error: any;
    signOut: (props: useSignOutProps) => void;
    callback?: () => void;
}

export function handleAuthErrors({error, signOut, callback = () => null}: handleAuthErrorsProps) {
    if (error instanceof ResponseError) {
        if (error.response.status === 401) {
            //TODO o co chodzi z tym errorem
            signOut({
                title: 'Error',
                message: "do sprawdzenia",
                color: 'red',
                withCloseButton: true,
                className: 'sign-out-notification',
                icon: <IconInfoHexagon/>,
            });
            callback && callback();
        }
    }
}