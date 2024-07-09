import {ActionIcon, Box, Menu, Tooltip} from '@mantine/core';
import {IconColumns} from '@tabler/icons-react';
import {MRT_ShowHideColumnsMenu} from 'mantine-react-table';

import {TableToolboxProps} from './TableToolbox.tsx';
import {TableToolboxIndicator} from './TableToolboxIndicator.tsx';

const TableColumnsVisibility = (props: TableToolboxProps) => {
    return (
        <Menu>
            <Menu.Target>
                <Box h={34}>
                    <TableToolboxIndicator disabled={props.table.getIsAllColumnsVisible()}>
                        <Tooltip label="Toggle column visibility">
                            <ActionIcon size="lg" variant="default">
                                <IconColumns />
                            </ActionIcon>
                        </Tooltip>
                    </TableToolboxIndicator>
                </Box>
            </Menu.Target>
            <MRT_ShowHideColumnsMenu table={props.table} />
        </Menu>
    );
};

export {TableColumnsVisibility};
