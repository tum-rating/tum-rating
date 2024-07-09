import {renderHook} from '@testing-library/react';

import {useHowInterestingRating} from '@/hooks';

describe('useHowInterestingRating', () => {
    it('should return correct message and color based on score', () => {
        const {result} = renderHook(() => useHowInterestingRating(1));
        expect(result.current.message).toBe('Boring');
        expect(result.current.color).toBe('red');

        const {result: result2} = renderHook(() => useHowInterestingRating(3));
        expect(result2.current.message).toBe('Moderate');
        expect(result2.current.color).toBe('yellow');

        const {result: result3} = renderHook(() => useHowInterestingRating(5));
        expect(result3.current.message).toBe('Interesting');
        expect(result3.current.color).toBe('green');
    });
});
