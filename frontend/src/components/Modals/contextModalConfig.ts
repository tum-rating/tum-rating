import { ReactNode } from 'react';

export const contextModalConfig = (modalName: string, modalTitle: ReactNode | string) => {
    return {
        modal: modalName,
        title: modalTitle,
        centered: true,
        innerProps: {},
        size: 'sm',
        overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
        },
    };
};
