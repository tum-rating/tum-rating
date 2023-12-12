import { Avatar, Badge, Flex, Text } from '@mantine/core';
import { Box, Group, ThemeIcon } from '@mantine/core';
import { IconStarFilled } from '@tabler/icons-react';

interface CommentProps {
    comment: string;
    createdAt: string;
    howEasyRating: number;
    howInterestingRating: number;
    userId: string;
    _id: string;
    userReview: {
        userId: string;
    };
}

export const Comment = (props: CommentProps) => {
    const { userId, howInterestingRating, howEasyRating, comment, createdAt, userReview,userName } = props;

    if (!userId) return '';
    const userCommentFlag = (userReview || {}).userId === userId;
    return (
        <>
            <Box
                data-comment={userCommentFlag ? 'user-comment' : 'comment'}
                p="sm"
                style={{
                    borderRadius: 'var(--mantine-radius-lg)',
                    border: userCommentFlag ? '1px solid var(--mantine-color-green-light)' : '1px solid var(--mantine-color-gray-3)',
                    background: userCommentFlag ? 'var(--mantine-color-green-light)' : 'auto',
                }}
            >
                <Group>
                    <Avatar radius="xl" color="cyan" alt={userId}>
                        {userName.slice(0, 2)}
                    </Avatar>
                    <div>
                        <Text size="sm">
                            {userName}{' '}
                            {userCommentFlag && (
                                <Badge ml="auto" variant="light">
                                    Your Review
                                </Badge>
                            )}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {new Date(createdAt).toLocaleString()}
                        </Text>
                    </div>
                </Group>
                <Text pl={54} pt="sm" size="sm">
                    <Box mb={10}>
                        <Flex align="center" gap={3} fz="sm" fw={600}>
                            <Text fz="xs" c="dimmed">
                                How easy
                            </Text>
                            <ThemeIcon c="yellow" variant="white" size="xs">
                                <IconStarFilled></IconStarFilled>
                            </ThemeIcon>
                            {howEasyRating}
                        </Flex>
                        <Flex align="center" gap={3} fz="sm" fw={600}>
                            <Text fz="xs" c="dimmed">
                                How interesting
                            </Text>
                            <ThemeIcon c="yellow" variant="white" size="xs">
                                <IconStarFilled></IconStarFilled>
                            </ThemeIcon>
                            {howInterestingRating}
                        </Flex>
                    </Box>
                    {comment}
                </Text>
            </Box>
        </>
    );
};
