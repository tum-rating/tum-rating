import { fireEvent, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { Drawer } from '../Drawer';

import { render } from 'tests/unit/utils/render';

describe('Drawer', () => {
    it('should render without crashing', async () => {
        render(<Drawer open={false} toggle={() => {}} />);
        const container = await screen.findByTestId('drawer');
        expect(container.firstChild).toBeInTheDocument();
    });

    it('should have container with content and backdrop', async () => {
        render(<Drawer open={false} toggle={() => {}} />);
        const container = await screen.findByTestId('drawer');
        expect(container.firstChild).toBeInTheDocument();
        const content = await screen.findByTestId('drawer-content');
        expect(content).toBeInTheDocument();
        const backdrop = await screen.findByTestId('drawer-backdrop');
        expect(backdrop).toBeInTheDocument();
    });

    it('should have proper styles when open is true', async () => {
        render(<Drawer open={true} toggle={() => {}} />);
        const container = document.querySelector("[data-testid='drawer']");
        let style = window.getComputedStyle(container);
        expect(style.transform).toBe('translateX(0px)');
    });

    it('should have proper styles when open is false', async () => {
        render(<Drawer open={false} toggle={() => {}} />);
        const container = document.querySelector("[data-testid='drawer']");
        let style = window.getComputedStyle(container);
        expect(style.transform).toBe(`translateX(-320px)`);
    });

    it('should call the toggle function when backdrop is clicked', async () => {
        const toggleMock = vi.fn();
        render(<Drawer open={true} toggle={toggleMock} />);
        fireEvent.click(screen.getByTestId('drawer-backdrop'));
        expect(toggleMock).toHaveBeenCalled();
    });
});
