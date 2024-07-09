import {act, renderHook} from '@testing-library/react';

import {SearchProvider, useSearchContext} from '@/context';

describe('SearchContext', () => {
    it('should provide initial search query as empty string', () => {
        const wrapper = ({children}) => <SearchProvider>{children}</SearchProvider>;
        const {result} = renderHook(() => useSearchContext(), {wrapper});
        expect(result.current.searchQuery).toBe('');
    });

    it('should update search query when setSearchQuery is called', () => {
        const wrapper = ({children}) => <SearchProvider>{children}</SearchProvider>;
        const {result} = renderHook(() => useSearchContext(), {wrapper});
        act(() => {
            result.current.setSearchQuery('new query');
        });
        expect(result.current.searchQuery).toBe('new query');
    });
});
