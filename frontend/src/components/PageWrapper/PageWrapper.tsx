import { Box } from '@mantine/core';
import { HTMLAttributes, ReactNode } from 'react';

import classes from './PageWrapper.module.css';

import { CONTENT_TOP_SPACING, HEADER_HEIGHT, MAX_SITE_WIDTH } from '@/constants';

type PageWrapperProps = HTMLAttributes<HTMLElement> & {
    autoHeight?: boolean;
    children?: ReactNode;
};

const PageWrapper = (props: PageWrapperProps) => {
    const { children, style, autoHeight, ...rest } = props;
    return (
        <Box
            className={classes.pageWrapper}
            maw={MAX_SITE_WIDTH}
            style={{
                top: HEADER_HEIGHT + CONTENT_TOP_SPACING + 'px',
                bottom: autoHeight ? 0 : 'unset',
                ...style,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};

export { PageWrapper };
