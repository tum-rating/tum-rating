import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { CloseButton } from '../CloseButton';

import { render } from 'tests/unit/utils/render';

describe('CloseButton', () => {
    it('should render without crashing', () => {
        const { getByRole } = render(<CloseButton onClick={() => {}} />);
        expect(getByRole('button')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const onClickMock = vi.fn();
        const { getByRole } = render(<CloseButton onClick={onClickMock} />);
        fireEvent.click(getByRole('button'));
        expect(onClickMock).toHaveBeenCalled();
    });

    it('should not call onClick when disabled', () => {
        const onClickMock = vi.fn();
        const { getByRole } = render(<CloseButton onClick={onClickMock} disabled />);
        fireEvent.click(getByRole('button'));
        expect(onClickMock).not.toHaveBeenCalled();
    });

    it('should have proper styles', () => {
        const { getByRole } = render(<CloseButton onClick={() => {}} />);
        const button = getByRole('button');
        const style = window.getComputedStyle(button);
        expect(style.position).toBe('absolute');
        expect(style.top).toBe('10px');
        expect(style.right).toBe('10px');
        expect(style.zIndex).toBe('1');
    });
});
