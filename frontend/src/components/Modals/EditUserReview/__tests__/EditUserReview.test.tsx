import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';

import * as userLocalStorage from '@/auth/user.localstore.ts';
import { EditUserReviewModal } from '@/components/Modals/EditUserReview';
import { courseDetailsWithLoggedUserReview, generateJwtToken, user } from 'tests/mocks/dataGenerators.ts';
import { render } from 'tests/utils/render.tsx';

describe('EditUserReviewModal', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    describe('when user is logged in', () => {
        beforeEach(() => {
            userLocalStorage.saveUser(generateJwtToken());
        });

        it('should render EditUserReview modal without crashing', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <EditUserReviewModal
                        id={null}
                        context={null}
                        innerProps={{
                            courseId: '123',
                        }}
                    />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Semester')).toBeInTheDocument();
            });
            expect(screen.getByTestId('textarea')).toBeInTheDocument();
            expect(screen.getAllByTestId('editable-rating')).toHaveLength(2);
            expect(screen.getByText('Update')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });
        it('should render EditUserReview modal with filled fields', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <EditUserReviewModal
                        id={null}
                        context={null}
                        innerProps={{
                            courseId: '123',
                        }}
                    />
                </QueryClientProvider>,
            );
            const userReview = courseDetailsWithLoggedUserReview.reviews.find((x: any) => x.userId === user.id);
            await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

            expect(screen.getByTestId('textarea')).toBeInTheDocument();
            expect(screen.getByTestId('select')).toBeInTheDocument();

            expect(screen.getByDisplayValue(userReview?.comment)).toBeInTheDocument();
            expect(screen.getByDisplayValue(userReview?.semester)).toBeInTheDocument();
        });
    });
});
