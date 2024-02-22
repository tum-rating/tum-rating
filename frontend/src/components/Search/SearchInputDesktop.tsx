import {CloseButton, Combobox, Highlight, ScrollArea, Text, TextInput, ThemeIcon, useCombobox} from "@mantine/core";
import {useEffect, useMemo, useState} from "react";
import {useSearchReviews} from "@/reviews/useSearchReviews.tsx";
import {useDebouncedState} from "@mantine/hooks";
import {Review} from "@/reviews/types.ts";

import classes from "./SearchInputDesktop.module.css"
import {IconSearch} from "@tabler/icons-react";
import clsx from "clsx";

const SearchInputDesktop = () => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState('');
    const [empty, setEmpty] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useDebouncedState('', 150);


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
            <Combobox.Option value={item.courseId} key={item.courseId}>
                <Highlight highlight={value.split(' ')}
                           highlightStyles={{
                               backgroundImage:
                                   'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                               fontWeight: 700,
                               WebkitBackgroundClip: 'text',
                               WebkitTextFillColor: 'transparent',
                           }}
                >
                    {item.course}
                </Highlight>
            </Combobox.Option>
        ));
    }, [groupedActions]);

    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                setValue(optionValue);
                combobox.closeDropdown();
            }}
            offset={0}
            withinPortal={false}
            store={combobox}
        >
            <Combobox.Target>
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
                        TUM-RATING © 2023
                    </Text>
                </Combobox.Footer>
            </Combobox.Dropdown>

        </Combobox>
    )
}

export {SearchInputDesktop}