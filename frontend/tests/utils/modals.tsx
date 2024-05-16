import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Link } from 'react-router-dom';
import { expect } from 'vitest';

import { render } from 'tests/utils/render.tsx';

async function openModal(path: string) {
    render(<Link data-testid="trigger" to={path} />);
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('trigger'));
    await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
}

export { openModal };
