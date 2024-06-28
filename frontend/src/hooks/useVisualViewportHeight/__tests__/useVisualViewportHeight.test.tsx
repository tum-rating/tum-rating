import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useVisualViewportHeight } from '../useVisualViewportHeight';

describe('useVisualViewportHeight', () => {
    it('should return initial viewport height', () => {
        const { result } = renderHook(() => useVisualViewportHeight());
        expect(result.current).toBe(window.visualViewport.height);
    });

    it('should update height when viewport is resized', () => {
        const { result } = renderHook(() => useVisualViewportHeight());

        act(() => {
            window.visualViewport.height = 500;
            window.visualViewport.dispatchEvent(new Event('resize'));
        });

        expect(result.current).toBe(500);
    });

    it('should clean up resize event listener on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window.visualViewport, 'removeEventListener');
        const { unmount } = renderHook(() => useVisualViewportHeight());

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
});
