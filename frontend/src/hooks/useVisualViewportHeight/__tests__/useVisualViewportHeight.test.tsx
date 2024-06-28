import {renderHook} from '@testing-library/react';

import {useVisualViewportHeight} from '../useVisualViewportHeight';

describe('useVisualViewportHeight', () => {
    it('should return 100% height on desktop', () => {
        const {result} = renderHook(() => useVisualViewportHeight());
        expect(result.current).toBe('100%');
    });
    //TODO - add tests for mobile
});
