import {Loader} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

import {DesktopSearchInput} from './DesktopSearchInput';
import {MobileSearchInput} from './MobileSearchInput';
import {useSearch} from './useSearch';

const SearchInput = () => {
    const searchProps = useSearch();
    const smallerMode = useMediaQuery('(max-width: 48em)');

    if (smallerMode === undefined) return <Loader size="xs" />;

    return smallerMode ? <MobileSearchInput {...searchProps} /> : <DesktopSearchInput {...searchProps} />;
};

export {SearchInput};
