import {renderHook} from '@testing-library/react';

import {useCoursesTableColumns} from '../useCoursesTableColumns';

import {SearchProvider} from '@/context';

describe('useCoursesTableColumns', () => {
    it('should return correct columns for non-mobile devices', () => {
        const wrapper = ({children}) => <SearchProvider>{children}</SearchProvider>;
        const {result} = renderHook(() => useCoursesTableColumns(), {wrapper});
        const columns = result.current.columns;
        expect(columns.some((column) => column.header === 'Professor')).toBe(true);
    });
});
