import {screen} from '@testing-library/react';

import {ReviewsBox} from '../ReviewsBox';

import {render} from 'tests/unit/utils/render';

describe('ReviewsBox', () => {
    it('should render the number of reviews correctly when votes are provided', () => {
        render(<ReviewsBox votes={10} isLoading={false} />);
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should render "Number of reviews" text', () => {
        render(<ReviewsBox votes={10} isLoading={false} />);
        expect(screen.getByText('Number of reviews')).toBeInTheDocument();
    });

    it('should render the IconUsersGroup component', () => {
        render(<ReviewsBox votes={10} isLoading={false} />);
        expect(screen.getByTestId('reviews-box-icon')).toBeInTheDocument();
    });

    it('should apply the correct color when votes are zero', () => {
        render(<ReviewsBox votes={0} isLoading={false} />);
        const icon = screen.getByTestId('reviews-box-icon');
        expect(icon).toHaveStyle('stroke: gray');
    });

    it('should apply the correct color when votes are non-zero', () => {
        render(<ReviewsBox votes={5} isLoading={false} />);
        const icon = screen.getByTestId('reviews-box-icon');
        expect(icon).toHaveStyle('stroke: black');
    });
});
