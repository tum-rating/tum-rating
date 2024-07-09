import { ActionIcon, CloseButton, Combobox, Loader, ScrollArea, TextInput, ThemeIcon, useCombobox } from '@mantine/core';
import { useDebouncedState, useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconSearch } from '@tabler/icons-react';
import clsx from 'clsx';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';

import classes from './SearchInputDesktop.module.css';

import { CopyrightFooter } from '@/components/CopyrightFooter';
import { SearchHighlight } from '@/components/Highlight';
import { ComboboxEmpty } from '@/components/Search/ComboboxEmpty.tsx';
import { PAGE_SIZE } from '@/constants';
import { useSearchContext } from '@/context';
import { Course } from '@/courses/types.ts';
import { useSearchCourses } from '@/courses/useSearchCourses.tsx';
import { useScrollLock } from '@/hooks/useScrollLock';

const SearchInputDesktop = () => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });
    const scrollAreaRef = useRef(null);
    const { searchQuery, setSearchQuery } = useSearchContext();
    const [value, setValue] = useState('');
    const [empty, setEmpty] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useDebouncedState('', 350);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const smallerMode = useMediaQuery('(max-width: 48em)');
    const navigate = useNavigate();
    const location = useLocation();
    const { lock, unlock } = useScrollLock({ autoLock: false });
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isMobileOnly) {
            setIsSearchOpen(location.hash === '#search');
        } else {
            setIsSearchOpen(false);
        }
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search');
        if (search) {
            setValue(search);
        }
    }, [location]);

    useEffect(() => {
        setDebouncedQuery(value);
    }, [value]);

    useEffect(() => {
        if (searchQuery.length === 0) {
            setValue('');
        }
    }, [searchQuery]);

    const { data, fetchNextPage, isLoading } = useSearchCourses(debouncedQuery);

    const [previousData, setPreviousData] = useState([]);

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.courses.map((el) => el)).flat();
            setPreviousData(newRecords);
        }
    }, [data]);

    useEffect(() => {
        if (!isSearchOpen) {
            unlock();
        } else {
            lock();
        }
    }, [isSearchOpen]);

    const groupedActions = useMemo(() => (previousData ? previousData : []), [previousData]);

    useEffect(() => {
        setEmpty(groupedActions.length === 0);
    }, [groupedActions]);

    const options = useMemo(() => {
        return (groupedActions || []).map((item: Course) => (
            <Combobox.Option className={classes.option} value={item._id} key={item._id}>
                <SearchHighlight value={value.split(' ')} text={item.name} />
                <SearchHighlight
                    value={value.split(' ')}
                    text={item.professor}
                    textStyles={{
                        fz: 'xs',
                        fw: 500,
                        c: 'dimmed',
                    }}
                />
            </Combobox.Option>
        ));
    }, [groupedActions]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.length) {
            navigate('/?search=' + value);
            setSearchQuery(value);
            combobox.closeDropdown();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setSearchQuery('');
        setValue('');
        navigate('#');
        combobox.closeDropdown();
    };

    if (smallerMode) {
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
                            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
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
                                />a
                            </form>
                        </Combobox.EventsTarget>
                        <Combobox.Options className={classes.searchInputMobileOptions}>
                            <ScrollArea.Autosize h="calc(100dvh - 58px)" ref={searchInputRef} type="scroll" className={classes.searchInputMobileScrollArea}>
                                {empty ? <ComboboxEmpty value={value} isLoading={isLoading} /> : options}
                            </ScrollArea.Autosize>
                        </Combobox.Options>
                        <Combobox.Footer>
                            <CopyrightFooter />
                        </Combobox.Footer>
                    </Combobox>
                )}
            </>
        );
    }

    if (smallerMode === undefined) return <Loader size="xs" />;

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
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
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
                        viewportRef={scrollAreaRef}
                        type="scroll"
                        onScrollPositionChange={(event) => {
                            const { y } = event;
                            if (y >= PAGE_SIZE * 50 * data.pageParams.at(-1) - 10) {
                                fetchNextPage();
                            }
                        }}
                    >
                        {empty ? <ComboboxEmpty value={value} isLoading={isLoading} /> : options}
                    </ScrollArea.Autosize>
                </Combobox.Options>
                <Combobox.Footer>
                    <CopyrightFooter />
                </Combobox.Footer>
            </Combobox.Dropdown>
        </Combobox>
    );
};

export { SearchInputDesktop };
