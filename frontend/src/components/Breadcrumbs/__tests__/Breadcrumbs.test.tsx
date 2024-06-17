import { screen } from '@testing-library/react';

import { Breadcrumbs } from '@/components/Breadcrumbs/Breadcrumbs';
import { render } from 'tests/unit/utils/render';

describe('Breadcrumbs', () => {
    it('should render without crashing', () => {
        render(<Breadcrumbs courseName="Test Course" isLoading={false} />);
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should display the correct course name', () => {
        render(<Breadcrumbs courseName="Test Course" isLoading={false} />);
        expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    it('should display skeleton when loading', () => {
        render(<Breadcrumbs courseName="Test Course" isLoading={true} />);
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
});
