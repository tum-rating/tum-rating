import { ReactNode } from 'react';

export const contextModalConfig = (modalName: string, modalTitle: ReactNode | string) => {
    return {
        modal: modalName,
        title: modalTitle,
        centered: true,
        height: "100%",
        innerProps: {
        },
    };
};
