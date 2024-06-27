import {ActionIcon} from "@mantine/core";
import {IconX} from "@tabler/icons-react";


const CloseButton = ({onClick}) =>
    <ActionIcon pos="absolute" variant="subtle" onClick={onClick} style={{
        top: 10,
        right: 10,
        zIndex: 1
    }}>
        <IconX/>
    </ActionIcon>

export {CloseButton}