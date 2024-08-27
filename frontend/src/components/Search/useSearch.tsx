import {Combobox, useCombobox} from '@mantine/core';
import {useDebouncedCallback} from '@mantine/hooks';
import {useEffect, useMemo, useState} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useLocation, useNavigate} from 'react-router-dom';

import {SearchHighlight} from '@/components/Highlight';
import classes from '@/components/Search/SearchInput.module.css';
import {useSearchContext} from '@/context';
import {Course} from '@/courses/types.ts';
import {useSearchCourses} from '@/courses/useSearchCourses';
import {useScrollLock} from '@/hooks/useScrollLock';
import {sortCoursesByMatchingFactor} from "@/utils/sortCoursesByMatchingFactor.ts";
import {splitSearchQueryIntoWords} from "@/utils/splitSearchQueryIntoWords.ts";

const useSearch = () => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const {setSearchQuery} = useSearchContext();
    const [value, setValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const {lock, unlock} = useScrollLock({autoLock: false});
    const [previousData, setPreviousData] = useState(null);

    const debouncedUpdate = useDebouncedCallback((newValue) => {
        setDebouncedValue(newValue);
        setIsLoading(false);
    }, 400);

    const {data, fetchNextPage, isLoading: queryLoading} = useSearchCourses(debouncedValue);

    useEffect(() => {
        setIsSearchOpen(isMobileOnly && location.hash === '#search');
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search');
        if (search) setValue(search);
    }, [location]);

    useEffect(() => {
        if (!isSearchOpen) unlock();
        else lock();
    }, [isSearchOpen, lock, unlock]);

    useEffect(() => {
        setIsLoading(queryLoading);
    }, [queryLoading]);

    useEffect(() => {
        debouncedUpdate(value);
    }, [value]);

    useEffect(() => {
        if (data) {
            setPreviousData(data);
        }
    }, [data]);

    const options = useMemo(() => {
        const words = splitSearchQueryIntoWords(value);
        return sortCoursesByMatchingFactor(previousData?.pages.flatMap((page: {
            courses: Course[]
        }) => page.courses) || [], value).map((item) => (
            <Combobox.Option className={classes.option} value={item._id} key={item._id}>
                <SearchHighlight highlight={words}>{item.name}</SearchHighlight>
                <SearchHighlight highlight={words} fz="xs" fw={500} c="dimmed">
                    {item.professor}
                </SearchHighlight>
            </Combobox.Option>
        ),);
    }, [previousData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value) {
            navigate(`/?search=${value}`);
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

    return {
        combobox,
        value,
        debouncedValue,
        setValue,
        isSearchOpen,
        setIsSearchOpen,
        isLoading,
        options,
        handleSubmit,
        handleClear,
        fetchNextPage,
        data,
    };
};

export {useSearch};
