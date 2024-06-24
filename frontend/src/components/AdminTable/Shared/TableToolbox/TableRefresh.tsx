import {ActionIcon, Tooltip, Flex, Box, ThemeIcon} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";

import {TableToolboxProps} from "./TableToolbox.tsx";

const TableRefresh = (props:TableToolboxProps) =>{
    return (
            <Box>
                <Tooltip label="Refresh">
                    <ActionIcon visibleFrom={'sm'} size="lg" variant="default" onClick={() => props.customActions.refresh()}>
                        <IconRefresh size={20} />
                    </ActionIcon>
                </Tooltip>
                <Flex align="center" gap={4} hiddenFrom={'sm'} onClick={() => props.customActions.refresh()} h={28}>
                    <ThemeIcon variant="default">
                        <IconRefresh size={22} />
                    </ThemeIcon>
                    Refresh
                </Flex>
            </Box>
    );
}

export {TableRefresh}