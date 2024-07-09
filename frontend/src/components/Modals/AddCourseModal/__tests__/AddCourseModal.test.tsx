import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {act} from 'react';
import {describe, expect, it} from 'vitest';

import * as userLocalStorage from '@/auth/user.localstore.ts';
import {AddCourseModal} from '@/components/Modals/AddCourseModal';
import {generateJwtToken} from 'tests/unit/mocks/dataGenerators.ts';
import {render} from 'tests/unit/utils/render.tsx';

describe('AddCourseModal', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    describe('when user is logged in', async () => {
        beforeEach(() => {
            userLocalStorage.saveUser(generateJwtToken());
        });

        it('should display form when user is logged in', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddCourseModal context={null} innerProps={null} id={null} />
                </QueryClientProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('textarea')).toBeInTheDocument();
                expect(screen.getByTestId('submit')).toBeInTheDocument();
            });
        });
        it('should display error if course URL is invalid', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddCourseModal context={null} innerProps={null} id={null} />
                </QueryClientProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId('textarea')).toBeInTheDocument();
                expect(screen.getByTestId('submit')).toBeInTheDocument();
            });

            const textarea = screen.getByTestId('textarea');

            textarea.focus();
            act(() => {
                fireEvent.change(textarea, {target: {value: 'https://cam1dent/courses/950600157?$scrollTo=toc_overview'}});
            });
            const submitButton = screen.getByRole('button', {name: 'Add Course Proposal'});
            const form = screen.getByTestId('add-course-proposal-form');
            fireEvent.submit(form, {
                button: submitButton,
            });
            expect(screen.getByText('Please provide a valid course URL from TUM Campus Portal')).toBeInTheDocument();
        });
    });

    describe('when user is not logged in', async () => {
        beforeEach(() => {
            userLocalStorage.removeUser();
        });
        it('should display panel with login/register buttons and message', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddCourseModal context={null} innerProps={null} id={null} />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('message')).toBeInTheDocument();
                expect(screen.getByTestId('sign-in-btn')).toBeInTheDocument();
                expect(screen.getByTestId('sign-up-btn')).toBeInTheDocument();
            });
        });
    });
});
