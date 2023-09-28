import { createStyles, Loader } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    loader: {
        position: 'fixed',
        bottom: 50,
        left: 'calc(50% - 30px)',
        right: '0',
        background: theme.colors.blue[1],
        zIndex: 300,
        padding: 8,
        borderRadius: 50,
    },
}));

export const BottomTableLoader = () => {
    const { classes } = useStyles();
    return <Loader className={classes.loader} size="60" />;
};
