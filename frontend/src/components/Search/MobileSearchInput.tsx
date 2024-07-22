import {ActionIcon, CloseButton, Combobox, LoadingOverlay, ScrollArea, TextInput} from '@mantine/core';
import {IconArrowLeft, IconSearch} from '@tabler/icons-react';
import clsx from 'clsx';
import {useRef} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useNavigate} from 'react-router-dom';

import {CopyrightFooter} from '@/components/CopyrightFooter';
import {ComboboxEmpty} from '@/components/Search/ComboboxEmpty.tsx';
import classes from '@/components/Search/SearchInputDesktop.module.css';

const MobileSearchInput = ({combobox, value, setValue, isSearchOpen, setIsSearchOpen, empty, isLoading, options, handleSubmit, handleClear}) => {
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
                                height={100}
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
                                rightSection={value !== '' && <CloseButton size="sm" onMouseDown={(event) => event.preventDefault()} onClick={handleClear} aria-label="Clear value" />}
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
                        <ScrollArea.Autosize h="calc(100dvh - 58px)" ref={searchInputRef} type="scroll" className={classes.searchInputMobileScrollArea}>
                            {<LoadingOverlay visible={isLoading} />}
                            {empty && !isLoading ? <ComboboxEmpty value={value} isLoading={isLoading} /> : options}
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
