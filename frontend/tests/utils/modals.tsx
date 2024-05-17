import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect } from 'vitest';

async function openModal() {
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('trigger'));
    expect(screen.getByTestId('tri1gger')).toBeInTheDocument();
}

export { openModal };
