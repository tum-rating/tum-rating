import { useMemo } from 'react';

export function useHowEasyRating(score: number | undefined) {
    return useMemo(() => {
        let message = 'No reviews';
        let color = 'gray';
        if (score !== undefined) {
            if (score > 0 && score < 2) {
                message = 'Very Difficult';
                color = 'red';
            } else if (score >= 2 && score < 4) {
                message = 'Moderate';
                color = 'yellow';
            } else if (score >= 4 && score <= 5) {
                message = 'Easy';
                color = 'green';
            }
        }
        return { message, color };
    }, [score]);
}
