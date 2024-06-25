import { render } from '@testing-library/react';

import { Keyframe } from '../Keyframe';

describe('Keyframe component', () => {
    it('renders correctly with string animation properties', () => {
        const { container } = render(
            <Keyframe name="test" animationProps={{ '0%': 'opacity: 0', '100%': 'opacity: 1' }} />
        );
        expect(container.firstChild).toHaveTextContent('@keyframes test {0% { opacity: 0 }100% { opacity: 1 }}');
    });

    it('renders correctly with CSSProperties animation properties', () => {
        const { container } = render(
            <Keyframe name="test" animationProps={{ '0%': { opacity: '0' }, '100%': { opacity: '1' } }} />
        );
        expect(container.firstChild).toHaveTextContent('@keyframes test {0% { opacity:0; }100% { opacity:1; }}');
    });

    it('renders correctly with mixed animation properties', () => {
        const { container } = render(
            <Keyframe name="test" animationProps={{ '0%': 'opacity: 0', '100%': { opacity: '1' } }} />
        );
        expect(container.firstChild).toHaveTextContent('@keyframes test {0% { opacity: 0 }100% { opacity:1; }}');
    });

    it('renders correctly with empty animation properties', () => {
        const { container } = render(
            <Keyframe name="test" animationProps={{}} />
        );
        expect(container.firstChild).toHaveTextContent('@keyframes test { }');
    });
});