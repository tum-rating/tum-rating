import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Link } from 'react-router-dom';
import { expect } from 'vitest';

import { getPath, Paths } from '@/routes/paths.ts';
import { render } from 'tests/utils/render.tsx';

async function openModal(path: Paths) {
    render(<Link data-testid="trigger" to={getPath(path)} />);
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('trigger'));
    await waitFor(() => {
        expect(screen.getByRole('dialog1')).toBeInTheDocument();
    });
}

export { openModal };
