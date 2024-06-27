import { IconKey } from "@tabler/icons-react";
import { screen } from '@testing-library/react';

import { AuthModalHeader } from '../AuthModalHeader';

import {render} from "tests/unit/utils/render.tsx";

describe('AuthModalHeader', () => {
    it('renders with correct title and subtitle', () => {
        render(<AuthModalHeader title="Test Title" subTitle="Test Subtitle" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders with default icon when no icon prop is provided', () => {
        render(<AuthModalHeader title="Test Title" subTitle="Test Subtitle" />);
        expect(screen.getByRole('img', { name: /icon/i })).toBeInTheDocument();
    });

    it('renders with provided icon when icon prop is provided', () => {
        render(<AuthModalHeader title="Test Title" subTitle="Test Subtitle" icon={<IconKey width={21}/>} />);
        expect(screen.getByRole('img', { name: /icon/i })).toBeInTheDocument();
    });

    it('does not render with default icon when icon prop is provided', () => {
        render(<AuthModalHeader title="Test Title" subTitle="Test Subtitle" icon={<IconKey width={21}/>} />);
        expect(screen.queryByRole('img', { name: /default icon/i })).not.toBeInTheDocument();
    });
});