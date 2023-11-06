import React, { ReactNode } from 'react';
import { Button, Divider, Flex, Image, Text } from '@mantine/core';
import type { ActionProps } from '../types.ts';
import { Review } from '@/reviews/types.ts';
import notFoundImage from '../../../assets/img/not-found.png';
import { openAddCourseModal } from '@/components/Modals/AddCourseModal';
import classes from './SpotlightActionList.module.css';
import { SpotlightAction } from '@/components/Spotlight/SpotlightAction';

export interface ActionsListProps extends React.ComponentPropsWithoutRef<'div'> {
    actions: Review[];
    actionComponent?: ReactNode;
    hovered: number;
    query: string;
    nothingFoundMessage?: React.ReactNode;
    close: () => void;

    onActionTrigger(action: ActionProps): void;
}

export function ActionsList({ actions, actionComponent: Action, hovered, onActionTrigger, query, nothingFoundMessage, close, ...others }: ActionsListProps) {
    const items = actions.map((item, index) => {
        return <SpotlightAction data-testid="cypress-global-search-item" query={query} key={item._id} action={item} hovered={index === hovered} onTrigger={() => onActionTrigger(item)} radius={4} />;
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
                                    <Image data-testid="cypress-global-search-nothing-found-img" src={notFoundImage} alt="Nothing found" fit="contain" width={50} />
                                    <Text c="dimmed" className={classes.nothingFound} ta="center" fz="md">
                                        {nothingFoundMessage}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Divider variant="dashed" size="md" orientation="vertical" />
                            <Flex w="50%" direction="column" align="flex-start" gap={10} style={{ opacity: 1 }}>
                                <Text data-testid="cypress-global-search-nothing-found-text" size="xs" c="dimmed" w={110}>
                                    If you don't find the course you are looking for, you can
                                </Text>
                                <Button
                                    variant="gradient"
                                    size="compact-sm"
                                    gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
                                    data-testid="cypress-open-add-new-course-modal-btn"
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
