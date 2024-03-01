import {
    ActionIcon,
    CloseButton,
    Combobox,
    Loader,
    ScrollArea,
    Text,
    TextInput,
    ThemeIcon,
    useCombobox
} from "@mantine/core";
import {useEffect, useMemo, useRef, useState} from "react";
import {useSearchReviews} from "@/reviews/useSearchReviews.tsx";
import {useDebouncedState, useMediaQuery} from "@mantine/hooks";
import {Review} from "@/reviews/types.ts";

import classes from "./SearchInputDesktop.module.css"
import {IconArrowLeft, IconSearch} from "@tabler/icons-react";
import clsx from "clsx";
import {useLocation, useNavigate} from "react-router-dom";
import {SearchHighlight} from "@/components/Highlight";
import {clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll} from "@/utils";
import {isMobileOnly} from "react-device-detect";

const SearchInputDesktop = () => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState('');
    const [empty, setEmpty] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useDebouncedState('', 150);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const smallerMode = useMediaQuery('(max-width: 48em)');
    const navigate = useNavigate();
    const location = useLocation();
    const searchInputRef = useRef(null); // Create a ref for the search input

    useEffect(() => {
        if (searchInputRef.current) {
            disableBodyScroll(searchInputRef.current);
        }
        return () => {
            if (searchInputRef.current) {
                enableBodyScroll(searchInputRef.current);
            }
            clearAllBodyScrollLocks();
        };
    }, []);


    useEffect(() => {
        if (isMobileOnly) {
            setIsSearchOpen(location.hash === '#search');
        }else{
            setIsSearchOpen(false);
        }
    }, [location]);


    useEffect(() => {
        setDebouncedQuery(value);
    }, [value]);

    const {data} = useSearchReviews(debouncedQuery);

    const [previousData, setPreviousData] = useState(null);

    useEffect(() => {
        if (data) {
            setPreviousData(data);
        }
    }, [data]);


    const groupedActions = useMemo(() => previousData ? previousData.reviews : [], [previousData]);

    useEffect(() => {
        setEmpty(groupedActions.length === 0);
    }, [groupedActions]);


    const options = useMemo(() => {
        return (groupedActions || []).map((item: Review) => (
            <Combobox.Option className={classes.option} value={item._id} key={item.courseId}>
                <SearchHighlight value={value.split(' ')} text={item.course}/>
                <SearchHighlight value={value.split(' ')} text={item.professor} textStyles={{
                    fz: "xs",
                    fw: 500,
                    c: "dimmed"
                }}/>
            </Combobox.Option>
        ));
    }, [groupedActions]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.length) {
            navigate('/?search=' + value);
            setValue('');
            combobox.closeDropdown();
        }

    }

    if (smallerMode) {
        return (
            <>
                <ActionIcon variant="light" onClick={() => {
                    if (isMobileOnly) {
                        navigate('#search');
                    } else {
                        setIsSearchOpen(true);
                    }

                }}>
                    <IconSearch width={16} height={16}/>
                </ActionIcon>
                {
                    isSearchOpen && (
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
                                <form style={{width: "100%"}} onSubmit={handleSubmit}>
                                    <TextInput
                                        radius={0}
                                        height={100}
                                        size="xl"
                                        leftSection={
                                            <ActionIcon onClick={() => {
                                                setIsSearchOpen(false)
                                                combobox.closeDropdown();
                                            }}>
                                                <IconArrowLeft width={16} height={16}/>
                                            </ActionIcon>
                                        }
                                        rightSection={
                                            value !== '' && (
                                                <CloseButton
                                                    size="sm"
                                                    onMouseDown={(event) => event.preventDefault()}
                                                    onClick={() => {
                                                        setValue('')
                                                        combobox.closeDropdown()
                                                    }}
                                                    aria-label="Clear value"
                                                />
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
                                            setIsSearchOpen(false)
                                            combobox.closeDropdown()
                                        }}
                                    />
                                </form>
                            </Combobox.EventsTarget>
                            <Combobox.Options className={classes.searchInputMobileOptions}>
                                <ScrollArea.Autosize h="calc(100dvh - 58px)" ref={searchInputRef} type="scroll"
                                                     className={classes.searchInputMobileScrollArea}>
                                    {empty && <Combobox.Empty>No matching courses for "{value}"</Combobox.Empty>}
                                    {options}
                                </ScrollArea.Autosize>
                            </Combobox.Options>
                            <Combobox.Footer>
                                <Text fz="xs" c="dimmed">
                                    TUM-RATING © 2024
                                </Text>
                            </Combobox.Footer>
                        </Combobox>
                    )
                }


            </>
        )
    }

    if (smallerMode === undefined) return <Loader size="xs"/>;

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
                <form style={{width: "100%"}} onSubmit={handleSubmit}>
                    <TextInput
                        leftSection={
                            <ThemeIcon variant="light">
                                <IconSearch width={16} height={16}/>
                            </ThemeIcon>
                        }
                        rightSection={
                            value !== '' && (
                                <CloseButton
                                    size="sm"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => {
                                        setValue('')
                                        combobox.closeDropdown()
                                    }}
                                    aria-label="Clear value"
                                />
                            )
                        }
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
                    <ScrollArea.Autosize mah="50vh" type="scroll">
                        {empty && <Combobox.Empty>No matching courses for "{value}"</Combobox.Empty>}
                        {options}
                    </ScrollArea.Autosize>
                </Combobox.Options>
                <Combobox.Footer>
                    <Text fz="xs" c="dimmed">
                        TUM-RATING © 2024
                    </Text>
                </Combobox.Footer>
            </Combobox.Dropdown>

        </Combobox>
    )
}

export {SearchInputDesktop}