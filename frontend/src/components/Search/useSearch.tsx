import {Combobox, useCombobox} from '@mantine/core';
import {useDebouncedCallback} from '@mantine/hooks';
import {useEffect, useMemo, useState} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useLocation, useNavigate} from 'react-router-dom';

import {SearchHighlight} from '@/components/Highlight';
import classes from '@/components/Search/SearchInputDesktop.module.css';
import {useSearchContext} from '@/context';
import {Course} from '@/courses/types.ts';
import {useSearchCourses} from '@/courses/useSearchCourses';
import {useScrollLock} from '@/hooks/useScrollLock';

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
    }, 250);

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

    const splitSearchQueryIntoWords = (value: string) => {
        const separators = [' ', ',', '.', '-'];
        const words = value.split(new RegExp(`[${separators.join('')}]`));
        return words.filter(Boolean);
    };

    const sorter = (data: Course[]) => {
        const dataLength = data.length;
        const dataWithMatchingFactor = [];
        const words = splitSearchQueryIntoWords(value.toLowerCase());
        const exactMatchBonus = 10000;

        for (let i = 0; i < dataLength; i++) {
            const item = data[i];
            const name = item.name.toLowerCase();
            const professor = item.professor.toLowerCase();
            let matchingFactor = 0;
            words.forEach((word) => {
                const nameIndex = name.indexOf(word);
                const professorIndex = professor.indexOf(word);

                if (nameIndex !== -1) {
                    matchingFactor += 100 - (nameIndex * 100) / name.length;
                }

                if (professorIndex !== -1) {
                    matchingFactor += 100 - (professorIndex * 100) / professor.length;
                }
            });

            if (name === value.toLowerCase() || professor === value.toLowerCase()) {
                matchingFactor += exactMatchBonus;
            }

            dataWithMatchingFactor.push({
                ...item,
                matchingFactor,
            });
        }
        return dataWithMatchingFactor.sort((a, b) => b.matchingFactor - a.matchingFactor);
    };

    const options = useMemo(() => {
        const words = splitSearchQueryIntoWords(value);
        return sorter(previousData?.pages.flatMap((page: {courses: Course[]}) => page.courses) || []).map((item) => (
            <Combobox.Option className={classes.option} value={item._id} key={item._id}>
                <SearchHighlight highlight={words}>{item.name}</SearchHighlight>
                <SearchHighlight highlight={words} fz="xs" fw={500} c="dimmed">
                    {item.professor}
                </SearchHighlight>
            </Combobox.Option>
        ));
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
