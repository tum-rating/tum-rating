import { MantineProvider } from '@mantine/core';
import { screen } from '@testing-library/react';

import { UserAvatar } from '@/components/Avatar/UserAvatar';
import {render} from "tests/utils/render.tsx";


describe('UserAvatar', () => {
    it('should render without crashing', () => {
        render(
            <MantineProvider>
                <UserAvatar />
            </MantineProvider>
        );
        const avatarElement = screen.getByRole('img');
        expect(avatarElement).toBeInTheDocument();
    });

    it('should display the correct svg', () => {
        render(
            <MantineProvider>
                <UserAvatar />
            </MantineProvider>
        );
        const svgElement = screen.getByRole('img');
        expect(svgElement).toHaveAttribute('viewBox', '0 0 80 80');
    });
});