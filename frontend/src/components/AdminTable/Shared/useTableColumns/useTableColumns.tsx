import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import {useEffect, useState} from 'react';

interface FilterStateProps {
    [key: string]: {
        key: string;
        selected: string[];
        records: string[];
    };
}

interface SortStateProps {
    columnAccessor: string;
    direction: 'asc' | 'desc';
}

const useTableColumns = (
    initialData: any[],
    filterableColumns: string[],
    setData: (data: any[]) => void
) => {
    const [sortState, setSortState] = useState<SortStateProps | null>(null);
    const [filterState, setFilterState] = useState<FilterStateProps>({});

    useEffect(() => {
        const hashMap: FilterStateProps = {};

        filterableColumns.forEach((v) => {
            const valuesMap = initialData?.map((x) => {
                return x[v]
            })
            hashMap[v] = {
                key: v,
                selected: [],
                records: uniq(valuesMap.flat())
            }
        })
        setFilterState(hashMap);
    }, [initialData]);

    const setFilter = (key: string, value: string[]) => {
        const newFilterState = {...filterState};
        newFilterState[key].selected = value
        setFilterState(newFilterState);
    }

    useEffect(() => {
        if (!initialData) return;
        let tempData = initialData, filteredData = [];
        if (filterState) {
            filteredData = initialData.filter((item) => {
                let result = true;
                Object.keys(filterState).forEach((key) => {
                    if (filterState[key].selected.length > 0) {
                        if (Array.isArray(item[key])) {
                            if (!filterState[key].selected.some(selectedValue => item[key].includes(selectedValue))) {
                                result = false;
                            }
                        } else {
                            if (filterState[key].selected.indexOf(item[key]) === -1) {
                                result = false;
                            }
                        }
                    }
                })
                return result;
            })
            tempData = filteredData;
        }
        if (sortState) {
            const sortedData = sortBy(tempData, item => {
                const value = item[sortState.columnAccessor];
                if (Array.isArray(value)) {
                    return value.join('');
                }
                return value;
            });
            tempData = sortState.direction === 'desc' ? sortedData.reverse() : sortedData;
        }
        setData(tempData);
    }, [sortState, filterState]);

    const resetFilters = () => {
        const hashMap: FilterStateProps = {};

        filterableColumns.forEach((v) => {
            const valuesMap = initialData?.map((x) => {
                return x[v]
            })
            hashMap[v] = {
                key: v,
                selected: [],
                records: uniq(valuesMap.flat())
            }
        })
        setFilterState(hashMap);
    }

    const resetSorting = () => {
        setSortState(null);
    }

    return { sortState, setSortState, filterState, setFilter, data: initialData, resetFilters, resetSorting };
};

export {useTableColumns,SortStateProps,FilterStateProps};