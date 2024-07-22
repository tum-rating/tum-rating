import {Combobox, useCombobox} from '@mantine/core';
import {useDebouncedCallback} from '@mantine/hooks';
import {FormEvent, useEffect, useMemo, useState} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useLocation, useNavigate} from 'react-router-dom';

import {SearchHighlight} from '@/components/Highlight';
import classes from '@/components/Search/SearchInputDesktop.module.css';
import {useSearchContext} from '@/context';
import {useSearchCourses} from '@/courses/useSearchCourses.tsx';
import {useScrollLock} from '@/hooks/useScrollLock';

const useSearch = () => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const {searchQuery, setSearchQuery} = useSearchContext();
    const [value, setValue] = useState('');
    const [empty, setEmpty] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const {lock, unlock} = useScrollLock({autoLock: false});

    const [debouncedValue, setDebouncedValue] = useState(value);
    const debouncedUpdate = useDebouncedCallback((newValue) => {
        setDebouncedValue(newValue);
        setInternalLoading(false);
    }, 400);

    const {data, fetchNextPage, isLoading: queryLoading} = useSearchCourses(debouncedValue);

    const [previousData, setPreviousData] = useState([]);

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
        if (searchQuery.length === 0) {
            setValue('');
        }
    }, [searchQuery]);

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

    const searchWords = useMemo(() => value.split(' ').filter(Boolean), [data]);

    const countMatchingWords = (searchWordsSet: Set<string>, text: string, separators: string[] = [' ', ',', '.', '-']) => {
        let uniformText = text.toLowerCase();
        separators.forEach((sep) => {
            uniformText = uniformText.replace(new RegExp(`\\${sep}`, 'g'), ' ');
        });

        const textWords = new Set(uniformText.split(' ').filter(Boolean));
        return Array.from(searchWordsSet).reduce((count, word) => (textWords.has(word) ? count + 1 : count), 0);
    };

    const options = useMemo(() => {
        const searchWordsSet = new Set(searchWords.map((word) => word.toLowerCase()));

        return (groupedActions || [])
            .map((item) => {
                const nameMatchCount = countMatchingWords(searchWordsSet, item.name);
                const professorMatchCount = countMatchingWords(searchWordsSet, item.professor);
                return {...item, matchCount: nameMatchCount + professorMatchCount};
            })
            .sort((a, b) => b.matchCount - a.matchCount)
            .map((item) => (
                <Combobox.Option className={classes.option} value={item._id} key={item._id}>
                    <SearchHighlight value={searchWords} text={item.name}/>
                    <SearchHighlight
                        value={searchWords}
                        text={item.professor}
                        textStyles={{
                            fz: 'xs',
                            fw: 500,
                            c: 'dimmed',
                        }}
                    />
                </Combobox.Option>
            ));
    }, [groupedActions, searchWords]);

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

    useEffect(() => {
        setInternalLoading(true);
        debouncedUpdate(value);
    }, [value]);

    useEffect(() => {
        if (!queryLoading) {
            setInternalLoading(false);
        }
    }, [queryLoading]);

    return {
        combobox,
        value,
        setValue,
        isSearchOpen,
        setIsSearchOpen,
        empty,
        isLoading: internalLoading || queryLoading,
        options,
        handleSubmit,
        handleClear,
        fetchNextPage,
        data,
    };
};

export {useSearch};
