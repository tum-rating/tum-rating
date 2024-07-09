import { ActionIcon, Box, Flex, Group, Menu } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import { TableColumnsVisibility } from './TableColumnsVisibility.tsx';
import { TableFilters } from './TableFilters.tsx';
import { TableFullscreen } from './TableFullscreen.tsx';
import { TableRefresh } from './TableRefresh.tsx';
import { TableSearch } from './TableSearch.tsx';
import { TableToolboxIndicator } from './TableToolboxIndicator.tsx';

interface TableToolboxProps {
    table: any;
    customActions?: {
        [key: string]: () => void;
    };
    config?: {
        tableFilters?: boolean;
        tableRefresh?: boolean;
        tableFullscreen?: boolean;
        toggleFilters?: boolean;
    };
}

const TableToolbox = (props: TableToolboxProps) => {
    const { config, ...rest } = props;
    const defaultConfig = {
        tableFilters: true,
        tableRefresh: true,
        tableFullscreen: true,
        toggleFilters: true,
        ...config,
    };

    const checkIfToolActive = () => {
        const { showColumnFilters, isFullScreen } = props.table.getState();
        return showColumnFilters || isFullScreen;
    };

    return (
        <Flex align="center" justify="flex-end" gap={4}>
            <TableSearch {...rest} />
            <TableColumnsVisibility {...rest} />
            <Menu>
                <Menu.Target>
                    <Box hiddenFrom={'sm'}>
                        <TableToolboxIndicator disabled={!checkIfToolActive()}>
                            <ActionIcon size="lg" variant="default">
                                <IconSettings />
                            </ActionIcon>
                        </TableToolboxIndicator>
                    </Box>
                </Menu.Target>
                <Menu.Dropdown hiddenFrom={'sm'}>
                    {defaultConfig.tableFilters && (
                        <Menu.Item>
                            <TableFilters {...rest} />
                        </Menu.Item>
                    )}
                    {defaultConfig.tableRefresh && (
                        <Menu.Item>
                            <TableRefresh {...rest} />
                        </Menu.Item>
                    )}
                    {defaultConfig.tableFullscreen && (
                        <Menu.Item>
                            <TableFullscreen {...rest} />
                        </Menu.Item>
                    )}
                </Menu.Dropdown>
            </Menu>
            <Group gap={4} visibleFrom={'sm'}>
                {defaultConfig.tableFilters && <TableFilters {...rest} />}
                {defaultConfig.tableRefresh && <TableRefresh {...rest} />}
                {defaultConfig.tableFullscreen && <TableFullscreen {...rest} />}
            </Group>
        </Flex>
    );
};

export { TableToolbox, TableToolboxProps };
