import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react';

import * as userLocalStorage from '@/auth/user.localstore.ts';
import { RecoveryModal } from '@/components/Modals/RecoveryModal';
import { generateJwtToken } from 'tests/unit/mocks/dataGenerators.ts';
import { render } from 'tests/unit/utils/render.tsx';

describe('RecoveryModal', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    describe('when user is logged in', async () => {
        beforeEach(() => {
            userLocalStorage.saveUser(generateJwtToken());
        });
        it('should not display recovery form', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <RecoveryModal context={null} id={null} innerProps={null} />
                </QueryClientProvider>,
            );

            expect(screen.queryByTestId('email')).not.toBeInTheDocument();
            expect(screen.queryByTestId('submit')).not.toBeInTheDocument();
        });
    });

    describe('when user is not logged in', async () => {
        beforeEach(() => {
            userLocalStorage.removeUser();
        });
        it('should display form without crashing', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <RecoveryModal context={null} id={null} innerProps={null} />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('email')).toBeInTheDocument();
                expect(screen.getByTestId('submit')).toBeInTheDocument();
            });
        });
        it('should display error message when form submission fails with wrong email', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <RecoveryModal context={null} id={null} innerProps={null} />
                </QueryClientProvider>,
            );

            let email = null;
            await waitFor(() => {
                email = screen.getByTestId('email');
            });
            act(() => {
                fireEvent.change(email, { target: { value: 'tum.de' } });
            });
            fireEvent.click(screen.getByTestId('submit'));

            await waitFor(() => {
                expect(screen.getByText('Invalid Email')).toBeInTheDocument();
            });
        });
    });
});
