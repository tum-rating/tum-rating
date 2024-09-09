import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {screen, waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';

import {Comment} from '@/components/Comment';
import {courseReview} from 'tests/unit/mocks/dataGenerators.ts';
import {render} from 'tests/unit/utils/render.tsx';

describe('Comment', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    const mockComment = courseReview;
    it('renders without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Comment {...mockComment} />
            </QueryClientProvider>,
        );
        expect(screen.getByTestId('comment')).toBeInTheDocument();
    });

    it('displays the correct comment data', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Comment {...mockComment} />
            </QueryClientProvider>,
        );
        expect(screen.getByText(mockComment.userName)).toBeInTheDocument();
        expect(screen.getByText(mockComment.comment)).toBeInTheDocument();
    });

    it('displays the correct ratings', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Comment {...mockComment} />
            </QueryClientProvider>,
        );
        expect(screen.getByText('How easy')).toBeInTheDocument();
        expect(screen.getByText('How interesting')).toBeInTheDocument();
    });

    it('displays the correct user review', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Comment userReview={{userId: mockComment.userId}} {...mockComment} />
            </QueryClientProvider>,
        );
        expect(screen.getByTestId('user-comment-badge')).toBeInTheDocument();
    });

    it('handles menu click correctly', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Comment userReview={{userId: mockComment.userId}} {...mockComment} />
            </QueryClientProvider>,
        );
        let menu = null;
        await waitFor(() => {
            menu = screen.getByTestId('menu');
        });
        await userEvent.click(menu);
        await waitFor(() => {
            expect(screen.getByTestId('menu-edit-review')).toBeInTheDocument();
        });
    });
});
