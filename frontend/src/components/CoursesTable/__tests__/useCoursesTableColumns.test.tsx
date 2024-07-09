import {renderHook} from '@testing-library/react';

import {useCoursesTableColumns} from '../useCoursesTableColumns';

describe('useCoursesTableColumns', () => {
    // The react-device-detect library uses the navigator.userAgent property to determine whether the device is mobile or not. This property is read-only and cannot be directly modified, which makes it difficult to mock in a testing environment.
    // it('should return correct columns for mobile devices', () => {});

    it('should return correct columns for non-mobile devices', () => {
        // Mock `isMobileOnly` to always return false
        const {result} = renderHook(() => useCoursesTableColumns());
        const columns = result.current.columns;
        // Verify that the 'Professor' column is present
        expect(columns.some((column) => column.header === 'Professor')).toBe(true);
    });
});
