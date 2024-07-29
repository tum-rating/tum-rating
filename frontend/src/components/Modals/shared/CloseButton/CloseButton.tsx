import {ActionIcon, ActionIconProps} from '@mantine/core';
import {IconX} from '@tabler/icons-react';

interface CloseButtonProps extends ActionIconProps {
    onClick: () => void;
}

const CloseButton = (props: CloseButtonProps) => {
    const {style, onClick, ...rest} = props;
    return (
        <ActionIcon
            data-testid="close-button"
            variant="subtle"
            style={{
                top: 10,
                right: 10,
                zIndex: 1,
                position: 'absolute',
                ...style,
            }}
            onClick={onClick}
            {...rest}
        >
            <IconX/>
        </ActionIcon>
    );
};

export {CloseButton};
