import { screen } from '@testing-library/react';

import { SearchHighlight } from '../SearchHighlight';

import { render } from 'tests/utils/render';

describe('SearchHighlight', () => {
    it('should render without crashing', async () => {
        render(<SearchHighlight value={['test']} text="This is a test" />);
        const element = await screen.findByText((_content, node) => {
            const hasText = (node: Element) => node.textContent === 'This is a test';
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));

            return nodeHasText && childrenDontHaveText;
        });
        expect(element).toBeInTheDocument();
    });

    it('should highlight the correct text', () => {
        render(<SearchHighlight value={['test']} text="This is a test" />);
        const element = screen.getByText(/test/i);
        expect(element).toHaveStyle('backgroundImage: linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))');
    });
});
