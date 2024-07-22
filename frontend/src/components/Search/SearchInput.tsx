import {Loader} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {MobileSearchInput} from './MobileSearchInput';
import {DesktopSearchInput} from './DesktopSearchInput';
import {useSearch} from './useSearch';

const SearchInput = () => {
    const {combobox, value, setValue, isSearchOpen, setIsSearchOpen, empty, isLoading, options, handleSubmit, handleClear, fetchNextPage, data} = useSearch();
    const smallerMode = useMediaQuery('(max-width: 48em)');

    if (smallerMode === undefined) return <Loader size="xs" />;

    return smallerMode ? <MobileSearchInput combobox={combobox} value={value} setValue={setValue} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} empty={empty} isLoading={isLoading} options={options} handleSubmit={handleSubmit} handleClear={handleClear} /> : <DesktopSearchInput combobox={combobox} value={value} setValue={setValue} empty={empty} isLoading={isLoading} options={options} handleSubmit={handleSubmit} handleClear={handleClear} fetchNextPage={fetchNextPage} data={data} />;
};

export {SearchInput};
