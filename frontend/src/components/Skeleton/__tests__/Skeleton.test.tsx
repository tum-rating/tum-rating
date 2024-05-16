import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import {render} from "tests/utils/render.tsx";

import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
    it('renders SkeletonLoader when loading is true', () => {
        render(<Skeleton loading={true} component={<div data-testid="component"/>} />);
        expect(screen.queryByTestId('component')).not.toBeInTheDocument();
    });

    it('renders component when loading is false', () => {
        render(<Skeleton loading={false} component={<div data-testid="component" />} />);
        expect(screen.getByTestId('component')).toBeInTheDocument();
    });

    it('renders component when loading is false and component is a function', () => {
        const Component = () => <div data-testid="component" />;
        render(<Skeleton loading={false} component={Component} />);
        expect(screen.getByTestId('component')).toBeInTheDocument();
    });
});