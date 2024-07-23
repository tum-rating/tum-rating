import {CloseButton, Combobox, ScrollArea, TextInput, ThemeIcon} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import clsx from 'clsx';
import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import {CopyrightFooter} from '@/components/CopyrightFooter';
import {ComboboxEmpty} from '@/components/Search/ComboboxEmpty.tsx';
import classes from '@/components/Search/SearchInputDesktop.module.css';
import {PAGE_SIZE} from '@/constants';

const DesktopSearchInput = ({combobox, value, debouncedValue, setValue, isLoading, options, handleSubmit, handleClear, fetchNextPage, data}) => {
    const navigate = useNavigate();
    const scrollAreaRef = useRef(null);
    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                navigate('/courses/' + optionValue);
                combobox.closeDropdown();
            }}
            offset={0}
            withinPortal={false}
            store={combobox}
        >
            <Combobox.Target>
                <form style={{width: '100%'}} onSubmit={handleSubmit}>
                    <TextInput
                        data-testid="search-trigger-desktop"
                        leftSection={
                            <ThemeIcon variant="light">
                                <IconSearch width={16} height={16} />
                            </ThemeIcon>
                        }
                        rightSection={value !== '' && <CloseButton size="sm" onMouseDown={(event) => event.preventDefault()} onClick={handleClear} aria-label="Clear value" />}
                        classNames={{
                            root: classes.searchInputDesktopRoot,
                            input: clsx(classes.searchInputDesktopInput, combobox.dropdownOpened && classes.searchInputDesktopInputActive),
                        }}
                        placeholder="Search..."
                        value={value}
                        onChange={(event) => {
                            setValue(event.currentTarget.value);
                            combobox.resetSelectedOption();
                            combobox.openDropdown();
                        }}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => {
                            combobox.openDropdown();
                        }}
                        onBlur={() => combobox.closeDropdown()}
                    />
                </form>
            </Combobox.Target>

            <Combobox.Dropdown className={classes.searchInputDesktopDropdown} hidden={data === null}>
                <Combobox.Options>
                    <ScrollArea.Autosize
                        mah="50vh"
                        mih={300}
                        viewportRef={scrollAreaRef}
                        type="scroll"
                        onScrollPositionChange={(event) => {
                            const {y} = event;
                            if (y >= PAGE_SIZE * 50 * data.pageParams.at(-1) - 10) {
                                fetchNextPage();
                            }
                        }}
                    >
                        {!options.length && <ComboboxEmpty value={debouncedValue} isLoading={isLoading} />}
                        {options}
                    </ScrollArea.Autosize>
                </Combobox.Options>
                <Combobox.Footer>
                    <CopyrightFooter />
                </Combobox.Footer>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export {DesktopSearchInput};
