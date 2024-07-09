import {screen} from '@testing-library/react';

import {CopyrightFooter} from '@/components/CopyrightFooter';
import {render} from 'tests/unit/utils/render.tsx';

describe('CopyrightFooter', () => {
    it('should render without crashing', () => {
        render(<CopyrightFooter />);
        const footerElement = screen.getByText(/TUM-RATING ©/i);
        expect(footerElement).toBeInTheDocument();
    });

    it('should display the current year', () => {
        render(<CopyrightFooter />);
        const currentYear = new Date().getFullYear();
        const footerElement = screen.getByText(new RegExp(`TUM-RATING © ${currentYear}`, 'i'));
        expect(footerElement).toBeInTheDocument();
    });
});
