import { ActionIcon, Box, Flex, ThemeIcon, Tooltip } from '@mantine/core';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';

import { TableToolboxProps } from './TableToolbox.tsx';
import { TableToolboxIndicator } from './TableToolboxIndicator.tsx';

const TableFullscreen = (props: TableToolboxProps) => {
    const { isFullScreen } = props.table.getState();

    const handleToggleFullScreen = () => {
        props.table.setIsFullScreen((current: boolean) => !current);
    };
    return (
        <Box>
            <Tooltip label="Toggle fullscreen">
                <ActionIcon visibleFrom={'sm'} size="lg" variant="default" onClick={handleToggleFullScreen}>
                    <TableToolboxIndicator disabled={!isFullScreen}>{isFullScreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}</TableToolboxIndicator>
                </ActionIcon>
            </Tooltip>
            <Flex align="center" gap={'xs'} hiddenFrom={'sm'} onClick={handleToggleFullScreen} h={28}>
                <TableToolboxIndicator disabled={!isFullScreen}>
                    <ThemeIcon variant="default">{isFullScreen ? <IconMinimize size={22} /> : <IconMaximize size={22} />}</ThemeIcon>
                </TableToolboxIndicator>
                {isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </Flex>
        </Box>
    );
};

export { TableFullscreen };
