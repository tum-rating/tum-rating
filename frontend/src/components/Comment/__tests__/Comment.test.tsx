import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Comment } from '@/components/Comment';
import { courseReview } from 'tests/unit/mocks/dataGenerators.ts';
import { render } from 'tests/unit/utils/render.tsx';

describe('Comment', () => {
    const mockComment = courseReview;
    it('renders without crashing', () => {
        render(<Comment {...mockComment} />);
        expect(screen.getByTestId('comment')).toBeInTheDocument();
    });

    it('displays the correct comment data', () => {
        render(<Comment {...mockComment} />);
        expect(screen.getByText(mockComment.userName)).toBeInTheDocument();
        expect(screen.getByText(mockComment.comment)).toBeInTheDocument();
    });

    it('displays the correct ratings', () => {
        render(<Comment {...mockComment} />);
        expect(screen.getByText('How easy')).toBeInTheDocument();
        expect(screen.getByText('How interesting')).toBeInTheDocument();
    });

    it('displays the correct user review', () => {
        render(<Comment userReview={{ userId: mockComment.userId }} {...mockComment} />);
        expect(screen.getByTestId('user-comment-badge')).toBeInTheDocument();
    });

    it('handles menu click correctly', async () => {
        render(<Comment userReview={{ userId: mockComment.userId }} {...mockComment} />);
        let menu = null;
        await waitFor(() => {
            menu = screen.getByTestId('menu');
        });
        await userEvent.click(menu);
        await waitFor(() => {
            expect(screen.getByTestId('menu-edit-review')).toBeInTheDocument();
            expect(screen.getByTestId('menu-delete-review')).toBeInTheDocument();
        });
    });

    it('handles menu click correctly when user review is not present', async () => {
        const mockCommentWithoutUserReview = { ...mockComment, userReview: {} };
        render(<Comment {...mockCommentWithoutUserReview} />);
        let menu = null;
        await waitFor(() => {
            menu = screen.getByTestId('menu');
        });
        await userEvent.click(menu);
        await waitFor(() => {
            expect(screen.getByTestId('menu-report-review')).toBeInTheDocument();
        });
    });
});
