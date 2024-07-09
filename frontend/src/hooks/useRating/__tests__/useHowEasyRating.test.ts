import {renderHook} from '@testing-library/react';

import {useHowEasyRating} from '@/hooks';

describe('useHowEasyRating', () => {
    it('should return correct message and color based on score', () => {
        const {result} = renderHook(() => useHowEasyRating(1));
        expect(result.current.message).toBe('Very Difficult');
        expect(result.current.color).toBe('red');

        const {result: result2} = renderHook(() => useHowEasyRating(3));
        expect(result2.current.message).toBe('Moderate');
        expect(result2.current.color).toBe('yellow');

        const {result: result3} = renderHook(() => useHowEasyRating(5));
        expect(result3.current.message).toBe('Easy');
        expect(result3.current.color).toBe('green');
    });
});
