import '@mantine/core/styles.css';
import { ActionIcon, Affix, Box, Button, Flex, Image, Paper, rem, Skeleton, Stack, Text, ThemeIcon } from '@mantine/core';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import classes from './Course.module.css';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowLeft, IconCirclePlus, IconEditCircle, IconSchool, IconStarFilled, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { Comment } from '@/components/Comment';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/auth/useUser.tsx';
import { useDetailReview } from '@/reviews/useReview.tsx';
import { ReactNode } from 'react';
import { openAddUserReviewModal } from '@/components/Modals/AddUserReview';
import { openEditUserReviewModal } from '@/components/Modals/EditUserReview';
import { NumberRatingBadge } from '@/components/Ratings';
import { openSignInModal } from '@/components/Modals';
const Course = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const { data, isFetching } = useDetailReview(id || '');
    const [scroll] = useWindowScroll();
    const CourseSkeletonTemplate = (value: ReactNode, skeletonComponent: ReactNode) => {
        return <>{isFetching ? skeletonComponent : value}</>;
    };
    const userReview = data?.reviews.find((data) => data.userId === user?.user.id);
    if (userReview) data?.reviews.sort((a) => (a.userId === user?.user.id ? -1 : 1));
    const scrollFlag = scroll.y >= 5;
    return (
        <Box className={classes.container} my={80}>
            <Flex px="lg" className={classes.courseControls} data-active={scrollFlag}>
                <Box className={classes.courseControlsOverlay} />
                <Button className={classes.courseControlsBackButton} variant="outline" mr="sm" size="xs" leftSection={<IconArrowLeft size="1.1rem" />} onClick={() => navigate('/')}>
                    Back to courses
                </Button>
                <ActionIcon className={classes.courseControlsBackActionButton} mr="sm" size="sm" onClick={() => navigate('/')}>
                    <IconArrowLeft size="1.1rem" />
                </ActionIcon>
                <Box className={classes.courseControlsBreadcrumbs}>
                    <Breadcrumbs courseName={CourseSkeletonTemplate(data?.course, <Skeleton width="150" height={15} radius="xl" />)} />
                </Box>
                <Box className={classes.courseControlsBtns}>
                    {!user ? (
                        <Button variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} onClick={() => openSignInModal()} leftSection={<IconCirclePlus style={{ width: rem(16), height: rem(16) }} />}>
                            Sign In do add review
                        </Button>
                    ) : userReview ? (
                        <Button variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 170 }} onClick={() => openEditUserReviewModal(data._id, userReview)} leftSection={<IconEditCircle style={{ width: rem(16), height: rem(16) }} />}>
                            Edit your review
                        </Button>
                    ) : (
                        <Button variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} onClick={() => openAddUserReviewModal(data._id)} leftSection={<IconCirclePlus style={{ width: rem(16), height: rem(16) }} />}>
                            Add review
                        </Button>
                    )}
                </Box>
            </Flex>
            <Box px="xl">
                <Stack p={0} gap={10} className={classes.courseHeader}>
                    <Box className={classes.courseBanner}>
                        <Image className={classes.image} h={100} mah={100} w={200} fit="contain" fallbackSrc="https://placehold.co/600x400?text=Placeholder" src="https://www.soafee.io/_next/image?url=%2Flogos%2Ftum.png&w=256&q=75" />
                    </Box>
                    {CourseSkeletonTemplate(
                        <Text fz={rem(24)} fw="700" lineClamp={5}>
                            {data?.course}{' '}
                        </Text>,
                        <Skeleton width="350" height={35} radius="xl" />,
                    )}
                    <Stack gap={25}>
                        <Flex align="center" gap={10} lh={1.5} wrap="wrap">
                            <Flex fz="xs" c="dimmed" align="center" gap={3} lh={0}>
                                <p>created: </p>
                                {CourseSkeletonTemplate(
                                    data ? (
                                        <Text fz="xs" c="black">
                                            {new Date(data.createdAt).toLocaleString()}
                                        </Text>
                                    ) : (
                                        ''
                                    ),
                                    <Skeleton width="150" height={15} radius="xl" />,
                                )}
                            </Flex>
                            <Flex fz="xs" c="dimmed" align="center" gap={3} lh={0}>
                                <p>updated: </p>
                                {CourseSkeletonTemplate(
                                    data ? (
                                        <Text fz="xs" c="black">
                                            {new Date(data.updatedAt).toLocaleString()}
                                        </Text>
                                    ) : (
                                        ''
                                    ),
                                    <Skeleton width="150" height={15} radius="xl" />,
                                )}
                            </Flex>
                        </Flex>
                        <Flex gap={10} wrap="wrap">
                            <Paper p="xs" className={classes.courseBadge}>
                                <Flex align="center" gap={5}>
                                    <ThemeIcon variant="white" c="yellow" size="xs">
                                        <IconStarFilled></IconStarFilled>
                                    </ThemeIcon>
                                    <Text fz="xs">How easy</Text>
                                </Flex>
                                {CourseSkeletonTemplate(
                                    <Box ml={rem(23)} fz="sm" fw={600}>
                                        <NumberRatingBadge score={data?.howEasyRatingAverage} />
                                    </Box>,
                                    <Skeleton width="50" height={23} ml={rem(23)} radius="xl" />,
                                )}
                            </Paper>
                            <Paper p="xs" className={classes.courseBadge}>
                                <Flex align="center" gap={5}>
                                    <ThemeIcon variant="white" c="yellow" size="xs">
                                        <IconStarFilled></IconStarFilled>
                                    </ThemeIcon>
                                    <Text fz="xs">How Interesting</Text>
                                </Flex>
                                {CourseSkeletonTemplate(
                                    <Box ml={rem(23)} fz="sm" fw={600}>
                                        <NumberRatingBadge score={data?.howInterestingRatingAverage} />
                                    </Box>,
                                    <Skeleton width="50" height={23} ml={rem(23)} radius="xl" />,
                                )}
                            </Paper>
                            <Paper p="xs" className={classes.courseBadge}>
                                <Flex align="center" gap={5}>
                                    <ThemeIcon c="green" variant="white" size="xs">
                                        <IconUsersGroup></IconUsersGroup>
                                    </ThemeIcon>
                                    <Text fz="xs">Number Of Votes</Text>
                                </Flex>
                                {CourseSkeletonTemplate(
                                    <Text ml={rem(23)} fz="sm" fw={600}>
                                        {data?.votesNumber}
                                    </Text>,
                                    <Skeleton width="50" height={23} ml={rem(23)} radius="xl" />,
                                )}
                            </Paper>
                            <Paper p="xs" className={classes.courseBadge}>
                                <Flex align="center" gap={5}>
                                    <ThemeIcon c="violet" variant="white" size="xs">
                                        <IconUser />
                                    </ThemeIcon>
                                    <Text fz="xs">Professor</Text>
                                </Flex>

                                {CourseSkeletonTemplate(
                                    <Text ml={rem(23)} fz="sm" fw={600}>
                                        {data?.professor}
                                    </Text>,
                                    <Skeleton width="50" height={23} ml={rem(23)} radius="xl" />,
                                )}
                            </Paper>
                            <Paper p="xs" className={classes.courseBadge}>
                                <Flex align="center" gap={5}>
                                    <ThemeIcon c="cyan" variant="white" size="xs">
                                        <IconSchool></IconSchool>
                                    </ThemeIcon>
                                    <Text fz="xs">Semesters</Text>
                                </Flex>
                                {CourseSkeletonTemplate(
                                    data ? (
                                        <Text ml={rem(23)} fz="sm" fw={600}>
                                            {data.offeredInSemesters.join(', ')}
                                        </Text>
                                    ) : (
                                        ''
                                    ),
                                    <Skeleton width="50" height={23} ml={rem(23)} radius="xl" />,
                                )}
                            </Paper>
                        </Flex>
                    </Stack>
                </Stack>
                <Affix className={classes.courseMobileAffix} position={{ bottom: 15, right: 20 }}>
                    {user ? (
                        userReview ? (
                            <Button variant="gradient" className={classes.courseMobileAffixButtons} gradient={{ from: 'teal', to: 'lime', deg: 170 }} color="green" onClick={() => openEditUserReviewModal(data._id, userReview)} leftSection={<IconEditCircle style={{ width: rem(16), height: rem(16) }} />}>
                                Edit your review
                            </Button>
                        ) : (
                            <Button variant="gradient" className={classes.courseMobileAffixButtons} gradient={{ from: 'indigo', to: 'blue', deg: 90 }} onClick={() => openAddUserReviewModal(data._id)} leftSection={<IconCirclePlus style={{ width: rem(16), height: rem(16) }} />}>
                                Add review
                            </Button>
                        )
                    ) : (
                        <>
                            <Button variant="gradient" className={classes.courseMobileAffixButtons} gradient={{ from: 'indigo', to: 'blue', deg: 90 }} onClick={() => openSignInModal()}>
                                Sign In to add review
                            </Button>
                        </>
                    )}
                </Affix>
                <Stack mt={50} mb={50} gap={25}>
                    <Text fz="md" fw={600}>
                        {data?.reviews.length ? 'Reviews:' : 'No reviews yet'}
                    </Text>
                    {data ? (
                        data.reviews.map((review, index) => {
                            return (
                                <>
                                    <Comment key={index} userReview={userReview} {...review} />
                                </>
                            );
                        })
                    ) : (
                        <>
                            <Skeleton height={150} mt={6} width="100%" radius="lg" />
                        </>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export { Course };
