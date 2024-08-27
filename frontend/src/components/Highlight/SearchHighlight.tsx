import {Highlight, HighlightProps} from '@mantine/core';

const SearchHighlight = ({children, ...props}: HighlightProps) => {
    return (
        <Highlight
            highlightStyles={{
                backgroundImage: 'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                fontWeight: 700,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
            {...props}
        >
            {children}
        </Highlight>
    );
};

export {SearchHighlight};
