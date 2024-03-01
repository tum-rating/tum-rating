import { useMemo } from 'react';

export function useHowInterestingRating(score: number | undefined) {
    return useMemo(() => {
        let message = 'No reviews';
        let color = 'gray';
        if (score === 0) message = 'No reviews';
        else if (score > 0 && score < 2) {
            message = 'Boring';
            color = 'red';
        } else if (score >= 2 && score < 4) {
            message = 'Moderate';
            color = 'yellow';
        } else if (score >= 4 && score <= 5) {
            message = 'Interesting';
            color = 'green';
        }
        return { message, color };
    }, [score]);
}
