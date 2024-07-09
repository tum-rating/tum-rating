import { ContextModalProps } from '@mantine/modals';
import { ReactNode } from 'react';

type OptionalContextModalProps = Partial<Omit<ContextModalProps, 'modal'>>;

interface ContextModalConfigProps extends OptionalContextModalProps {
    modal: string;
    title?: ReactNode;
}

export const contextModalConfig = (config: ContextModalConfigProps) => {
    const { modal: modalName, title: modalTitle } = config;
    return {
        modal: modalName,
        title: modalTitle,
        centered: true,
        padding: 0,
        innerProps: {},
        ...config,
    };
};
