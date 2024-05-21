import { ActionIcon, Badge, Flex, Menu, Rating, Text } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import classes from './Comment.module.css';

import { UserAvatar } from '@/components/Avatar';
import { NumberRatingBadge } from '@/components/Course';
import { getPath, Paths } from '@/routes/paths.ts';

interface CommentProps {
    comment: string;
    createdAt: string;
    howEasyRating: number;
    howInterestingRating: number;
    userId: string;
    _id: string;
    userName: string;
    userReview: {
        userId: string;
    };
}

export const Comment = (props: CommentProps) => {
    const { userId, howInterestingRating, howEasyRating, comment, createdAt, userReview, userName } = props;

    const navigate = useNavigate();

    if (!userId) return '';
    const userCommentFlag = (userReview || {}).userId === userId;

    return (
        <Flex p="md" data-comment={userCommentFlag ? 'user-comment' : 'comment'} direction="column" className={classes.comment} data-testid="comment">
            <Flex direction="column">
                <Flex justify="space-between" w="100%">
                    <Flex gap="xs">
                        <UserAvatar size="md" radius="xl" alt="user avatar" />
                        <Flex direction="column">
                            <Flex w="100%" align="center">
                                <Text maw={userCommentFlag ? '50vw' : '75vw'} truncate size="sm" fw="500">
                                    {userName}{' '}
                                </Text>
                                {userCommentFlag && (
                                    <Badge ml={4} size="xs" variant="light" color="green" data-testid="user-comment-badge">
                                        You
                                    </Badge>
                                )}
                            </Flex>
                            <Text size="xs" c="dimmed">
                                {new Date(createdAt).toLocaleString()}
                            </Text>
                        </Flex>
                    </Flex>
                    <Menu position="bottom-end" >
                        <Menu.Target data-testid="menu">
                            <ActionIcon variant="outline" color={userCommentFlag ? 'green' : 'auto'}>
                                <IconDotsVertical width={16} height={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {userCommentFlag ? (
                                <>
                                    <Menu.Item data-testid="menu-edit-review" onClick={() => navigate(getPath(Paths.editUserReview))}>
                                        <Text size="sm">Edit your review</Text>
                                    </Menu.Item>
                                    <Menu.Item data-testid="menu-delete-review">
                                        <Text size="sm" c="red">
                                            Delete your review
                                        </Text>
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item data-testid="menu-report-review">
                                    <Text c="red" size="sm">
                                        Report
                                    </Text>
                                </Menu.Item>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
                <Flex direction="column">
                    <Flex mt="xs" align="center" gap={3}>
                        <Text fz="xs" c="dimmed" mr={4}>
                            How easy
                        </Text>
                        <Rating readOnly={true} color="yellow" fractions={2} value={howEasyRating} size="xs" />
                        <NumberRatingBadge size="xs" variant="filled" score={howEasyRating} />
                    </Flex>
                    <Flex align="center" gap={3}>
                        <Text fz="xs" c="dimmed" mr={4}>
                            How interesting
                        </Text>
                        <Rating readOnly={true} color="yellow" fractions={2} value={howInterestingRating} size="xs" />
                        <NumberRatingBadge size="xs" variant="filled" score={howInterestingRating} />
                    </Flex>
                </Flex>
            </Flex>
            <Text style={{ wordBreak: 'break-word' }} mt="xs" size="sm" c="">
                {comment}
            </Text>
        </Flex>
    );
};
