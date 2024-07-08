import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {screen, waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {describe, expect, it} from 'vitest';

import {endpoints} from '@/api';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {UserButton} from '@/components/UserButton';
import {generateJwtToken, user} from 'tests/unit/mocks/dataGenerators.ts';
import {server} from 'tests/unit/mocks/node.ts';
import {render} from 'tests/unit/utils/render.tsx';

describe('UserButton', () => {
    describe('when user is logged in', () => {
        let queryClient: QueryClient;
        beforeEach(async () => {
            queryClient = new QueryClient();
            userLocalStorage.saveUser(generateJwtToken());
        });
        it('should render UserButton without dropdown', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserButton withoutDropdown={true}/>
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('user-btn-username-mobile')).toHaveTextContent(user.username);
                expect(screen.getByTestId('user-btn-email-mobile')).toHaveTextContent(user.email);
            });
            expect(screen.queryByRole('user-btn-desktop')).not.toBeInTheDocument();
        });
        it('should render UserButton with working dropdown', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserButton/>
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('user-btn-desktop')).toBeInTheDocument();
            });
            const menu = screen.getByTestId('user-btn-desktop');
            await waitFor(() => {
                expect(menu).toBeInTheDocument();
            });
            await userEvent.click(menu);
            await waitFor(
                () => {
                    expect(screen.getByTestId('user-btn-username-desktop')).toHaveTextContent(user.username);
                    expect(screen.getByTestId('user-btn-email-desktop')).toHaveTextContent(user.email);
                    expect(screen.getByTestId('logout')).toBeInTheDocument();
                },
                {timeout: 2000},
            );
        });
        it('should render UserButton with working logout option', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserButton/>
                </QueryClientProvider>,
            );
            let menu = null;
            await waitFor(() => {
                menu = screen.getByTestId('user-btn-desktop');
            });
            await userEvent.click(menu);
            await waitFor(() => {
                expect(screen.getByTestId('logout')).toBeInTheDocument();
            });
            await userEvent.click(screen.getByTestId('logout'));
            expect(userLocalStorage.getUser()).toBeNull();
            await waitFor(() => {
                expect(screen.queryByTestId('user-btn-username-desktop')).not.toBeInTheDocument();
                expect(screen.queryByTestId('user-btn-email-desktop')).not.toBeInTheDocument();
            });
        });
    });
    describe('when user is not logged in', () => {
        let queryClient: QueryClient;
        beforeEach(async () => {
            queryClient = new QueryClient();
        });
        it('should not render UserButton', async () => {
            server.use(
                http.get(endpoints.user, async () => {
                    return HttpResponse.json(null);
                }),
            );
            render(
                <QueryClientProvider client={queryClient}>
                    <UserButton/>
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.queryByTestId('no_user_provided')).toBeInTheDocument();
            });
        });
    });
});
