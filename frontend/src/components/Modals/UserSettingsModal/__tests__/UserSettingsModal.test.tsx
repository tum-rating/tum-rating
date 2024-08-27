import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import * as userLocalStorage from '@/auth/user.localstore.ts';
import {UserSettingsModal} from '@/components/Modals/UserSettingsModal/UserSettingsModal';
import {generateJwtToken, user} from 'tests/unit/mocks/dataGenerators.ts';
import {render} from 'tests/unit/utils/render.tsx';

describe('UserSettingsModal', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
        userLocalStorage.saveUser(generateJwtToken());
    });

    it('should render user information correctly', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserSettingsModal context={null} id={null} innerProps={null} />
            </QueryClientProvider>,
        );
        await waitFor(() => {
            expect(screen.getByTestId('user-settings-username')).toHaveTextContent(user.username);
            expect(screen.getByTestId('user-settings-email')).toHaveTextContent(user.email);
        });
    });

    it('should show delete confirmation step when delete button is clicked', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserSettingsModal context={null} id={null} innerProps={null} />
            </QueryClientProvider>,
        );
        fireEvent.click(screen.getByTestId('user-settings-delete-button'));
        await waitFor(() => {
            expect(screen.getByTestId('user-settings-delete-confirmation-button')).toBeInTheDocument();
        });
    });

    it('should display error if email does not match in final account deletion stage', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserSettingsModal context={null} id={null} innerProps={null} />
            </QueryClientProvider>,
        );

        fireEvent.click(screen.getByTestId('user-settings-delete-button'));
        await waitFor(() => {
            expect(screen.getByTestId('user-settings-delete-confirmation-button')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('user-settings-delete-confirmation-button'));
        await waitFor(() => {
            expect(screen.getByTestId('user-settings-delete-final-button')).toBeInTheDocument();
        });

        fireEvent.input(screen.getByTestId('user-settings-delete-email-input'), {target: {value: 'wrongemail@example.com'}});
        fireEvent.click(screen.getByTestId('user-settings-delete-final-button'));

        await waitFor(() => {
            expect(screen.getByText("That's a sign. You should not delete your account.")).toBeInTheDocument();
        });
    });
});
