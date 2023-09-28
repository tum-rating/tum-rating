import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import { createStyles, DefaultProps, Group, rem, Text, UnstyledButton } from '@mantine/core';
import { BrowserView } from 'react-device-detect';

const useStyles = createStyles((theme) => ({
    root: {
        height: rem(34),
        paddingLeft: theme.spacing.sm,
        paddingRight: rem(5),
        borderRadius: theme.radius.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        zIndex: 200,
        border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        [theme.fn.smallerThan('xs')]: {
            padding: 0,
            width: rem(34),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors.dark[5], 0.85) : theme.fn.rgba(theme.colors.gray[0], 0.55),
        },
    },

    shortcut: {
        fontSize: rem(11),
        lineHeight: 1,
        padding: `${rem(4)} ${rem(7)}`,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]}`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    },
    hiddenMobile: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },
}));

interface SearchControlProps extends DefaultProps, React.ComponentPropsWithoutRef<'button'> {
    onClick(): void;
}

const SpotlightControl = ({ className, ...others }: SearchControlProps) => {
    const { classes, cx } = useStyles();

    return (
        <UnstyledButton data-testid="cypress-global-search" {...others} className={cx(classes.root, className)}>
            <Group spacing="xs" className={classes.hiddenMobile}>
                <IconSearch size={rem(14)} stroke={1.5} />
                <Text size="sm" color="dimmed" pr={80}>
                    Search
                </Text>
                <BrowserView>
                    <Text weight={700} className={classes.shortcut}>
                        /
                    </Text>
                </BrowserView>
            </Group>
            <Group spacing="xs" className={classes.hiddenDesktop}>
                <IconSearch color="black" stroke={1.5} />
            </Group>
        </UnstyledButton>
    );
};

export { SpotlightControl };
