import React from 'react';
import { Group, Highlight, Text, UnstyledButton } from '@mantine/core';
import type { ActionProps } from '../types.ts';
import classes from './SpotlightAction.module.css';

export interface SpotlightActionProps extends React.ComponentPropsWithoutRef<'button'> {
    action: ActionProps;
    hovered: boolean;
    query: string;
    radius: number;
    onTrigger(): void;
}

export function SpotlightAction({ action, hovered, onTrigger, query, radius, ...others }: SpotlightActionProps) {
    return (
        <UnstyledButton className={classes.action} data-hovered={hovered || undefined} tabIndex={-1} onMouseDown={(event) => event.preventDefault()} onClick={onTrigger} {...others}>
            <Group>
                <div className={classes.actionBody}>
                    <Highlight className={classes.actionHighlight} highlight={query.split(' ')}>
                        {action.course}
                    </Highlight>
                    {action.professor && (
                        <Text size="xs" className={classes.actionDescription} data-hovered={hovered || undefined}>
                            <Highlight className={classes.actionHighlight} highlight={query.split(' ')}>
                                {action.professor}
                            </Highlight>
                        </Text>
                    )}
                </div>
            </Group>
        </UnstyledButton>
    );
}
