import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { act } from 'react';

import { endpoints } from '@/api';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { SignInModal } from '@/components/Modals/SignInModal/SignInModal';
import { generateJwtToken } from 'tests/unit/mocks/dataGenerators.ts';
import { server } from 'tests/unit/mocks/node.ts';
import { render } from 'tests/unit/utils/render.tsx';

describe('SignInModal', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
    });

    describe('when user is logged in', async () => {
        beforeEach(() => {
            userLocalStorage.saveUser(generateJwtToken());
        });
        it('should not display sign in form', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <SignInModal context={null} id={null} innerProps={{}} />
                </QueryClientProvider>,
            );

            expect(screen.queryByTestId('email')).not.toBeInTheDocument();
            expect(screen.queryByTestId('password')).not.toBeInTheDocument();
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
                    <SignInModal context={null} id={null} innerProps={{}} />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('email')).toBeInTheDocument();
                expect(screen.getByTestId('password')).toBeInTheDocument();
                expect(screen.getByTestId('submit')).toBeInTheDocument();
            });
        });
        it('should display error message when form submission fails with wrong email or password', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <SignInModal context={null} id={null} innerProps={{}} />
                </QueryClientProvider>,
            );

            server.use(
                http.post(endpoints.signin, async () => {
                    return HttpResponse.error();
                }),
            );

            let email = null;
            let password = null;
            let submit = null;
            let form = null;

            await waitFor(() => {
                email = screen.getByTestId('email');
                password = screen.getByTestId('password');
                submit = screen.getByTestId('submit');
                form = screen.getByTestId('form');
            });
            act(() => {
                fireEvent.change(email, { target: { value: 'wrongemail@tum.de' } });
                fireEvent.change(password, { target: { value: 'wrongpassword' } });
            });
            fireEvent.submit(form, { button: submit });

            await waitFor(() => {
                expect(screen.getByTestId('error-message')).toBeInTheDocument();
            });
        });
    });
});
