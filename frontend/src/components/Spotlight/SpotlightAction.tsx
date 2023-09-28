import React from 'react';
import { createStyles, DefaultProps, Group, Highlight, rem, Selectors, Text, UnstyledButton } from '@mantine/core';
import type { SpotlightAction } from './types';

const useStyles = createStyles((theme) => ({
    action: {
        position: 'relative',
        display: 'block',
        width: '100%',
        padding: `${rem(10)} ${rem(12)}`,
        borderRadius: '4px',
        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
        }),

        '&[data-hovered]': {
            backgroundColor: theme.fn.primaryColor(),
            color: theme.white,
            ...theme.fn.hover({
                backgroundColor: theme.fn.primaryColor(),
            }),
        },
    },

    actionDescription: {
        color: theme.fn.dimmed(),

        '&[data-hovered]': {
            color: theme.white,
            opacity: 0.7,
        },
    },

    actionIcon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],

        '&[data-hovered]': {
            color: theme.white,
            opacity: 0.7,
        },
    },

    actionBody: {},

    actionHighlight: {
        '& [data-highlight]': {
            color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.black,
        },
    },
}));

export type DefaultActionStylesNames = Selectors<typeof useStyles>;

export interface DefaultActionProps extends DefaultProps<DefaultActionStylesNames>, React.ComponentPropsWithoutRef<'button'> {
    action: SpotlightAction;
    hovered: boolean;
    query: string;
    radius: number;

    onTrigger(): void;
}

export function DefaultAction({
    action,
    styles,
    classNames,
    hovered,
    onTrigger,

    query,
    radius,
    ...others
}: DefaultActionProps) {
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.action} data-hovered={hovered || undefined} tabIndex={-1} onMouseDown={(event) => event.preventDefault()} onClick={onTrigger} {...others}>
            <Group noWrap>
                <div className={classes.actionBody}>
                    <Highlight className={classes.actionHighlight} highlight={query}>
                        {action.course}
                    </Highlight>
                    {action.professor && (
                        <Text size="xs" className={classes.actionDescription} data-hovered={hovered || undefined}>
                            <Highlight className={classes.actionHighlight} highlight={query}>
                                {action.professor}
                            </Highlight>
                        </Text>
                    )}
                </div>
            </Group>
        </UnstyledButton>
    );
}
