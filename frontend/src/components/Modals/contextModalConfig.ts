import { ContextModalProps } from '@mantine/modals';
import {ReactNode} from "react";

type OptionalContextModalProps = Partial<Omit<ContextModalProps, 'modal'>>;

interface ContextModalConfigProps extends OptionalContextModalProps {
    modal: string;
    title?: ReactNode;
}

export const contextModalConfig = (config: ContextModalConfigProps) => {
    return {
        centered: true,
        height: '100%',
        innerProps: {},
        ...config,
    };
};
