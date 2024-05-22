import { Box, Text } from '@mantine/core';

import classes from './RouteLoader.module.css';

const RouteLoader = () => {
    return (
        <Box
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.5)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'var(--mantine-color-body)',
                gap: '17px',
            }}
        >
            <Box>
                <Text fz="14" fw={600}>
                    Loading...
                </Text>
            </Box>

            <div className={classes.loader}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className={classes.dot}></div>
                ))}
            </div>
        </Box>
    );
};

export { RouteLoader };
