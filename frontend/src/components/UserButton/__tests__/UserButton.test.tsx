import { UseQueryResult } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { User, useUser } from '@/auth/useUser.tsx';
import { UserButton } from '@/components/UserButton';
import { user } from 'tests/mocks/handlers.ts';
import { render } from 'tests/utils/render.tsx';

vi.mock('@/auth/useUser.tsx', () => ({
    useUser: vi.fn(),
}));

describe('UserButton', () => {
    beforeEach(() => {
        (useUser as jest.MockedFunction<typeof useUser>).mockReturnValue({
            data: user,
        } as UseQueryResult<User, Error>);
    });

    it('renders UserButton without dropdown', () => {
        render(<UserButton withoutDropdown={true} />);
        expect(screen.queryByTestId('username')).toBeInTheDocument();
        expect(screen.queryByTestId('email')).toBeInTheDocument();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders UserButton with dropdown', () => {
        render(<UserButton />);
        const button = screen.getByTestId('user-button');
        expect(button).toBeInTheDocument();
        userEvent.click(button);
    });
});
