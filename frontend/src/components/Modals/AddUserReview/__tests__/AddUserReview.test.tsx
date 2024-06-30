import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { endpoints } from '@/api';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview';
import { courseDetails, generateJwtToken } from 'tests/unit/mocks/dataGenerators.ts';
import { server } from 'tests/unit/mocks/node.ts';
import { render } from 'tests/unit/utils/render.tsx';

describe('AddUserReviewModal', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    describe('when user is logged in', async () => {
        beforeEach(() => {
            userLocalStorage.saveUser(generateJwtToken());
            server.use(
                http.get(endpoints.getSpecificCourse(':id'), async () => {
                    return HttpResponse.json(courseDetails);
                }),
            );
        });
        afterEach(() => {
            server.resetHandlers();
        });

        it('should render AddUserReview modal without crashing', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddUserReviewModal
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
            expect(screen.getByText('Send')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });

        it('should display error messages when submitting wrongly filled form', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddUserReviewModal
                        id={null}
                        context={null}
                        innerProps={{
                            courseId: '123',
                        }}
                    />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('textarea')).toBeInTheDocument();
                expect(screen.getByTestId('select')).toBeInTheDocument();
            });

            const submitButton = screen.getByRole('button', { name: 'Send' });
            const form = screen.getByTestId('form');
            fireEvent.submit(form, {
                button: submitButton,
            });
            expect(screen.getAllByText('This field is required')).toHaveLength(3);
            expect(screen.getAllByText('Comment should be at least 5 characters long')).toHaveLength(1);
        });
    });

    describe('when user is not logged in', () => {
        it('should display panel with login/register buttons and message', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddUserReviewModal
                        id={null}
                        context={null}
                        innerProps={{
                            courseId: null,
                        }}
                    />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('message')).toHaveTextContent('Only registered users can add reviews.');
                expect(screen.getByTestId('sign-in-btn')).toBeInTheDocument();
                expect(screen.getByTestId('sign-up-btn')).toBeInTheDocument();
            });
        });
    });
});
