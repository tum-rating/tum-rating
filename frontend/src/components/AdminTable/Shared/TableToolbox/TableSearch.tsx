import { CloseButton, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { TableToolboxProps } from './TableToolbox.tsx';

const TableSearch = (props: TableToolboxProps) => {
    const [inputValue, setInputValue] = useState(props.table.getState().globalFilter);

    useEffect(() => {
        setInputValue(props.table.getState().globalFilter);
    }, [props.table.getState().globalFilter]);

    return (
        <>
            <TextInput
                size={'sm'}
                leftSectionPointerEvents="none"
                leftSection={<IconSearch width={18} />}
                placeholder="Search"
                type={'search'}
                value={inputValue}
                onChange={(event) => {
                    setInputValue(event.target.value);
                    props.table.setGlobalFilter(event.target.value);
                }}
                rightSection={
                    <CloseButton
                        aria-label="Clear input"
                        style={inputValue ? { display: 'block' } : { display: 'none' }}
                        onClick={() => {
                            setInputValue('');
                            props.table.resetGlobalFilter();
                        }}
                    />
                }
            ></TextInput>
        </>
    );
};

export { TableSearch };
