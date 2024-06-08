import { act, renderHook } from '@testing-library/react';

import { TableScrollProvider, useTableScrollContext } from '@/context';

describe('TableScrollContext', () => {
    it('should provide initial values', () => {
        const wrapper = ({ children }) => <TableScrollProvider>{children}</TableScrollProvider>;
        const { result } = renderHook(() => useTableScrollContext(), { wrapper });

        expect(result.current.scrollY).toBe(0);
        expect(result.current.scrollIndex).toBe(0);
    });

    it('should update scrollY value', () => {
        const wrapper = ({ children }) => <TableScrollProvider>{children}</TableScrollProvider>;
        const { result } = renderHook(() => useTableScrollContext(), { wrapper });

        act(() => {
            result.current.setScrollY(100);
        });

        expect(result.current.scrollY).toBe(100);
    });

    it('should update scrollIndex value', () => {
        const wrapper = ({ children }) => <TableScrollProvider>{children}</TableScrollProvider>;
        const { result } = renderHook(() => useTableScrollContext(), { wrapper });

        act(() => {
            result.current.setScrollIndex(5);
        });

        expect(result.current.scrollIndex).toBe(5);
    });

    // it('should throw error when used outside of provider', () => {
    //     const { result } = renderHook(() => useTableScrollContext());
    //     expect(result.error).toEqual(Error('useTableScrollContext must be used within a ScrollProvider'));
    // });
});
