import {prettyDOM, screen} from '@testing-library/react';
import {userEvent} from "@testing-library/user-event";
import { describe, expect, it } from 'vitest';

import { UserButton } from '@/components/UserButton';
import { render } from 'tests/utils/render.tsx';

describe('UserButton', () => {
    it('renders UserButton without dropdown', () => {
        render(<UserButton withoutDropdown={true} />);
        expect(screen.queryByTestId('username')).toBeInTheDocument();
        expect(screen.queryByTestId('email')).toBeInTheDocument();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
//     it('renders UserButton with working dropdown', () => {
//         render(<UserButton />);
//
//         const button = screen.getByRole('button');
//         expect(button).toBeInTheDocument();
//
//         // Click the button to open the dropdown
//         userEvent.click(button);
//
//         // Check if username and email are present in the dropdown
//         expect(screen.getByTestId('username')).toBeInTheDocument();
//         expect(screen.getByTestId('email')).toBeInTheDocument();
//
// })
});
