import { UnstyledButtonProps } from '@mantine/core';
interface UserButtonProps extends UnstyledButtonProps {
    username: string;
    email: string;
    mode?: "mobile" | "desktop" | undefined;
}
export declare function UserButton({ username, email, mode }: UserButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
