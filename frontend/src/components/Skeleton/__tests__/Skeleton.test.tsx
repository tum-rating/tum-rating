import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import '@testing-library/jest-dom';
import { Skeleton } from '../Skeleton';

import { render } from 'tests/utils/render.tsx';

describe('Skeleton', () => {
    let component: any;

    beforeEach(() => {
        component = <div data-testid="component" />;
    });

    describe('when loading is true', () => {
        it('should not render the component', async () => {
            render(<Skeleton loading={true} component={component} />);
            await waitFor(() => {
                expect(screen.queryByTestId('component')).not.toBeInTheDocument();
            });
        });
    });

    describe('when loading is false', () => {
        it('should render the component', async () => {
            render(<Skeleton loading={false} component={component} />);
            await waitFor(() => {
                expect(screen.getByTestId('component')).toBeInTheDocument();
            });
        });

        it('should render the component when component is a function', async () => {
            const Component = () => component;
            render(<Skeleton loading={false} component={Component} />);
            await waitFor(() => {
                expect(screen.getByTestId('component')).toBeInTheDocument();
            });
        });
    });
});
