import {ActionIcon, Combobox, ScrollArea, TextInput} from '@mantine/core';
import {IconArrowLeft, IconSearch, IconX} from '@tabler/icons-react';
import clsx from 'clsx';
import {useRef} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useNavigate} from 'react-router-dom';

import {CopyrightFooter} from '@/components/CopyrightFooter';
import {ComboboxEmpty} from '@/components/Search/ComboboxEmpty.tsx';
import classes from '@/components/Search/SearchInput.module.css';
import {HEADER_HEIGHT} from '@/constants';

const MobileSearchInput = ({combobox, value, setValue, isSearchOpen, setIsSearchOpen, isLoading, options, handleSubmit, handleClear, debouncedValue}) => {
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    return (
        <>
            <ActionIcon
                data-testid="search-trigger-mobile"
                variant="light"
                onClick={() => {
                    if (isMobileOnly) {
                        navigate('#search');
                    } else {
                        setIsSearchOpen(true);
                    }
                }}
            >
                <IconSearch width={16} height={16} />
            </ActionIcon>
            {isSearchOpen && (
                <Combobox
                    onOptionSubmit={(optionValue) => {
                        navigate('/courses/' + optionValue);
                        combobox.closeDropdown();
                    }}
                    offset={9}
                    withinPortal={true}
                    store={combobox}
                >
                    <Combobox.EventsTarget>
                        <form style={{width: '100%'}} onSubmit={handleSubmit}>
                            <TextInput
                                radius={0}
                                height={54}
                                size="xl"
                                autoFocus
                                leftSection={
                                    <ActionIcon
                                        onClick={() => {
                                            setIsSearchOpen(false);
                                            combobox.closeDropdown();
                                        }}
                                    >
                                        <IconArrowLeft width={16} height={16} />
                                    </ActionIcon>
                                }
                                rightSection={
                                    value !== '' && (
                                        <ActionIcon
                                            variant="subtle"
                                            loading={isLoading}
                                            size="sm"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={(e) => {
                                                handleClear(e);
                                            }}
                                            aria-label="Clear value"
                                        >
                                            <IconX />
                                        </ActionIcon>
                                    )
                                }
                                classNames={{
                                    root: classes.searchInputMobileRoot,
                                    input: clsx(classes.searchInputMobileInput, combobox.dropdownOpened && classes.searchInputMobileInputActive),
                                }}
                                placeholder="Search..."
                                value={value}
                                onChange={(event) => {
                                    setValue(event.currentTarget.value);
                                    combobox.resetSelectedOption();
                                    combobox.openDropdown();
                                }}
                                onBlur={() => {
                                    setIsSearchOpen(false);
                                    combobox.closeDropdown();
                                }}
                            />
                        </form>
                    </Combobox.EventsTarget>
                    <Combobox.Options className={classes.searchInputMobileOptions}>
                        <ScrollArea.Autosize h={`calc(100dvh - ${HEADER_HEIGHT}px)`} ref={searchInputRef} type="scroll" className={classes.searchInputMobileScrollArea}>
                            {!options.length && <ComboboxEmpty value={debouncedValue} isLoading={isLoading} />}
                            {options}
                        </ScrollArea.Autosize>
                    </Combobox.Options>
                    <Combobox.Footer>
                        <CopyrightFooter />
                    </Combobox.Footer>
                </Combobox>
            )}
        </>
    );
};

export {MobileSearchInput};
