import React from 'react';
import { Button, createStyles, DefaultProps, Divider, Flex, Image, rem, Selectors, Text } from '@mantine/core';
import type { SpotlightAction } from './types';
import type { DefaultActionProps, DefaultActionStylesNames } from './SpotlightAction';
import { DefaultAction } from './SpotlightAction';
import { Review } from '@/reviews/types';
import notFoundImage from '../../assets/img/not-found.png';
import { openAddCourseModal } from '../Modals/AddCourseModal';

export type ActionsListStylesNames = Selectors<typeof useStyles> | DefaultActionStylesNames;

export interface ActionsListProps extends DefaultProps<ActionsListStylesNames>, React.ComponentPropsWithoutRef<'div'> {
    actions: Review[];
    actionComponent?: React.FC<DefaultActionProps>;
    hovered: number;
    query: string;
    nothingFoundMessage?: React.ReactNode;
    close: () => void;

    onActionTrigger(action: SpotlightAction): void;
}

const useStyles = createStyles((theme) => ({
    nothingFound: {},

    actions: {
        padding: `calc(${theme.spacing.xs} / 2)`,
    },

    actionsGroup: {
        textTransform: 'uppercase',
        fontSize: theme.spacing.xs,
        fontWeight: 700,
        padding: `${rem(10)} ${rem(12)}`,
        paddingBottom: 0,
        paddingTop: theme.spacing.md,
    },
}));

export function ActionsList({ actions, actionComponent: Action, hovered, onActionTrigger, query, nothingFoundMessage, close, ...others }: ActionsListProps) {
    const { classes } = useStyles();

    const items = actions.map((item, index) => {
        return <DefaultAction data-testid="cypress-global-search-item" query={query} key={item._id} action={item} hovered={index === hovered} onTrigger={() => onActionTrigger(item)} radius={4} />;
    });

    const shouldRenderActions = items.length > 0 || (!!nothingFoundMessage && query.trim().length > 0);

    return (
        <>
            {shouldRenderActions && (
                <div className={classes.actions} {...others}>
                    {items.length > 0 ? (
                        items
                    ) : (
                        <Flex gap={25} justify="center" style={{ position: 'relative', width: '100%', marginTop: '25px' }}>
                            <Flex w="50%" direction="column" align="flex-end" style={{ opacity: 1 }}>
                                <Flex align="center" direction="column">
                                    <Image data-testid="cypress-global-search-nothing-found-img" src={notFoundImage} alt="Nothing found" fit="contain" width={70} />
                                    <Text c="dimmed" className={classes.nothingFound} ta="center" fz="md">
                                        {nothingFoundMessage}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Divider variant="dashed" size="md" orientation="vertical" />
                            <Flex w="50%" direction="column" align="flex-start" gap={10} style={{ opacity: 1 }}>
                                <Text data-testid="cypress-global-search-nothing-found-text" size="xs" color="dimmed" w={110}>
                                    If you don't find the course you are looking for, you can
                                </Text>
                                <Button
                                    data-testid="cypress-open-add-new-course-modal-btn"
                                    compact
                                    onClick={() => {
                                        close();
                                        openAddCourseModal();
                                    }}
                                >
                                    Add a new course
                                </Button>
                            </Flex>
                        </Flex>
                    )}
                </div>
            )}
        </>
    );
}
