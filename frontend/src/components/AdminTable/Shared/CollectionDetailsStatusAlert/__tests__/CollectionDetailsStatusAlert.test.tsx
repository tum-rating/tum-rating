import { screen } from '@testing-library/react';

import { CollectionDetailsStatusAlert } from '../CollectionDetailsStatusAlert';

import { render } from 'tests/utils/render.tsx';

describe('CollectionDetailsStatusAlert', () => {
    it('renders without crashing', () => {
        render(<CollectionDetailsStatusAlert status={false} message="" type="success" />);
        const alert = screen.queryByRole('alert');
        expect(alert).not.toBeInTheDocument();
    });

    it('displays the correct success message', () => {
        render(<CollectionDetailsStatusAlert status={true} message="Success message" type="success" />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('displays the correct error message', () => {
        render(<CollectionDetailsStatusAlert status={true} message="Error message" type="error" />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });
});
