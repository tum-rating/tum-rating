import {Highlight, TextProps} from '@mantine/core';

interface SearchHighlightProps {
    value: string[];
    text: string;
    textStyles?: TextProps;
}

const SearchHighlight = ({value, text, textStyles}: SearchHighlightProps) => {
    return (
        <Highlight
            highlight={value}
            highlightStyles={{
                backgroundImage: 'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                fontWeight: 700,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
            {...textStyles}
        >
            {text}
        </Highlight>
    );
};

export {SearchHighlight};
