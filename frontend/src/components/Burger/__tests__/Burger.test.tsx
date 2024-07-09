import {fireEvent} from '@testing-library/react';
import {vi} from 'vitest';

import {Burger} from '../Burger';

import {render} from 'tests/unit/utils/render';

describe('Burger', () => {
    it('should render without crashing', () => {
        const {getByRole} = render(<Burger open={false} toggle={() => {}} />);
        expect(getByRole('button')).toBeInTheDocument();
    });

    it('should apply the active class when open is true', () => {
        const {getByRole} = render(<Burger open={true} toggle={() => {}} />);
        expect(getByRole('button')).toHaveClass('mantine-active');
    });

    it('should not apply the active class when open is false', () => {
        const {getByRole} = render(<Burger open={false} toggle={() => {}} />);
        expect(getByRole('button').firstChild).not.toHaveClass('active');
    });

    it('should call the toggle function when clicked', () => {
        const toggleMock = vi.fn();
        const {getByRole} = render(<Burger open={false} toggle={toggleMock} />);
        fireEvent.click(getByRole('button'));
        expect(toggleMock).toHaveBeenCalled();
    });
});
