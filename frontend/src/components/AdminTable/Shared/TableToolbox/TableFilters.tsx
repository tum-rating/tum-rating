import { ActionIcon, Box, Flex, ThemeIcon, Tooltip } from '@mantine/core';
import { IconFilter, IconFilterOff } from '@tabler/icons-react';

import { TableToolboxProps } from './TableToolbox.tsx';
import { TableToolboxIndicator } from './TableToolboxIndicator.tsx';

const TableFilters = (props: TableToolboxProps) => {
    return (
        <Tooltip label="Toggle column filters">
            <Box>
                <ActionIcon visibleFrom={'sm'} size="lg" variant="default" onClick={() => props.table.setShowColumnFilters((current: boolean) => !current)}>
                    <TableToolboxIndicator offset={1} disabled={!props.table.getState().showColumnFilters}>
                        {props.table.getState().showColumnFilters ? <IconFilterOff size={20} /> : <IconFilter size={20} />}
                    </TableToolboxIndicator>
                </ActionIcon>
                <Flex h={28} align="center" gap={4} hiddenFrom={'sm'} onClick={() => props.table.setShowColumnFilters((current: boolean) => !current)}>
                    <TableToolboxIndicator disabled={!props.table.getState().showColumnFilters}>
                        <ThemeIcon variant="default">{props.table.getState().showColumnFilters ? <IconFilterOff size={22} /> : <IconFilter size={22} />}</ThemeIcon>
                    </TableToolboxIndicator>
                    {props.table.getState().showColumnFilters ? 'Hide Column Filters' : 'Show Column Filters'}
                </Flex>
            </Box>
        </Tooltip>
    );
};

export { TableFilters };
