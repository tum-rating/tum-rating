import {Avatar, Badge, Box, Flex, Group, Rating, Text, ThemeIcon} from '@mantine/core';
import {IconLego, IconStarFilled} from '@tabler/icons-react';
import {NumberRatingBadge} from "@/components/Course";

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
    const {userId, howInterestingRating, howEasyRating, comment, createdAt, userReview, userName} = props;

    if (!userId) return '';
    const userCommentFlag = (userReview || {}).userId === userId;

    return (
        <Flex data-comment={userCommentFlag ? 'user-comment' : 'comment'} direction="column">
            <Group mb="xs">
                <Avatar variant={userCommentFlag ? "filled" : "light"}  radius="lg" color={userCommentFlag ? "green" : "indigo"} size="48" alt={userId}>
                    <IconLego width={32} height={32}/>
                </Avatar>
                <Flex justify="space-between">
                    <Flex direction="column" gap="4">
                        <Text size="sm" fw="500">
                            {userName}{' '}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {new Date(createdAt).toLocaleString()}
                        </Text>
                    </Flex>
                </Flex>
            </Group>
            {userCommentFlag && (
                <Badge mb="xs" variant="light" color="green">
                    Your Review
                </Badge>
            )}
            <Text pl="4" size="sm" c="">
                {comment}
            </Text>
            <Flex mt="xs" align="center" gap={3}>
                <Text fz="sm" c="dimmed" mr={4}>
                    How easy
                </Text>
                <Rating color="yellow" fractions={2} value={howEasyRating} size="xs"/>
                <NumberRatingBadge score={howEasyRating}/>
            </Flex>
            <Flex align="center" gap={3}>
                <Text fz="sm" c="dimmed" mr={4}>
                    How interesting
                </Text>
                <Rating color="yellow" fractions={2} value={howInterestingRating} size="xs"/>
                <NumberRatingBadge score={howInterestingRating}/>
            </Flex>
        </Flex>

    )


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
