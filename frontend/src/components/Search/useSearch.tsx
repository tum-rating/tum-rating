import {Combobox, useCombobox} from "@mantine/core";
import {useSearchContext} from "@/context";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {useDebouncedState} from "@mantine/hooks";
import {useLocation, useNavigate} from "react-router-dom";
import {useScrollLock} from "@/hooks/useScrollLock";
import {isMobileOnly} from "react-device-detect";
import {useSearchCourses} from "@/courses/useSearchCourses.tsx";
import {Course} from "@/courses/types.ts";
import classes from "@/components/Search/SearchInputDesktop.module.css";
import {SearchHighlight} from "@/components/Highlight";

const useSearch = () => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const { searchQuery, setSearchQuery } = useSearchContext();
    const [value, setValue] = useState('');
    const [empty, setEmpty] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useDebouncedState('', 350);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { lock, unlock } = useScrollLock({ autoLock: false });

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
            const newRecords = data.pages
                .map((v) => v.courses.map((el) => el))
                .flat();
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

    return {
        combobox,
        value,
        setValue,
        isSearchOpen,
        setIsSearchOpen,
        empty,
        isLoading,
        options,
        handleSubmit,
        handleClear,
        fetchNextPage,
        data,
    };
};

export {useSearch}
