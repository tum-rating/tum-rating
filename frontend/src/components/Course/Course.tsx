import '@mantine/core/styles.css';
import { Badge, Box, Button, Center, Divider, Flex, Image, rem, Text } from '@mantine/core';
import { IconAlien, IconCalendarMonth, IconCirclePlus, IconEditCircle } from '@tabler/icons-react';
import clsx from 'clsx';
import { Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import classes from './Course.module.css';
import { CourseControls } from './CourseControls.tsx';

import tumLogo from '@/assets/img/tum_logo.png';
import { useUser } from '@/auth/useUser.tsx';
import { Comment } from '@/components/Comment';
import { CourseHelmet } from '@/components/Course/CourseHelmet.tsx';
import { HowEasyRating } from '@/components/Course/HowEasyRating.tsx';
import { HowInterestingRating } from '@/components/Course/HowInterestingRating.tsx';
import { ReviewsBox } from '@/components/Course/ReviewsBox.tsx';
import { Skeleton } from '@/components/Skeleton';
import { CONTENT_TOP_SPACING, HEADER_HEIGHT, MAX_SITE_WIDTH } from '@/constants';
import { useDetailCourse } from '@/courses/useCourse.tsx';
import { getPath, Paths } from '@/routes/paths.ts';

const Course = () => {
    const { courseId: id } = useParams();
    const { data: user } = useUser();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useDetailCourse(id || '');
    useEffect(() => {
        const children = document.querySelectorAll('.children-animation > *');
        children.forEach((child: Element, index: number) => {
            (child as HTMLElement).style.animationDelay = `${0.025 * (index + 1)}s`;
        });
    }, []);

    let userReview = null;
    let reviews = data?.reviews;

    if (user) {
        userReview = reviews?.find((review) => review.userId === user.id);
        reviews = reviews?.filter((review) => review.userId !== user.id);
    }
    return (
        <>
            <CourseHelmet course={data} />
            <Box
                className={classes.container}
                maw={MAX_SITE_WIDTH}
                style={{
                    top: HEADER_HEIGHT + CONTENT_TOP_SPACING + 'px',
                }}
            >
                {isError ? (
                    <Box h="calc(100vh - 69px)">
                        <Center h="100%">
                            <Flex justify="center" align="center" direction="column" gap="xs">
                                <svg className={classes.notFoundImg} viewBox="0 0 72 72" width="64px" height="64px">
                                    <path d="M17.0312 64.4375C26.25 64.4375 33.5625 52.9688 33.5625 36.4375C33.5625 19.9062 26.25 8.46875 17.0312 8.46875C7.8125 8.46875 0.5 19.9062 0.5 36.4375C0.5 52.9688 7.8125 64.4375 17.0312 64.4375ZM54.9688 64.4375C64.1875 64.4375 71.5 52.9688 71.5 36.4375C71.5 19.9062 64.1875 8.46875 54.9688 8.46875C45.75 8.46875 38.4375 19.9062 38.4375 36.4375C38.4375 52.9688 45.75 64.4375 54.9688 64.4375ZM10.0625 47.1875C15.125 47.1875 18.4688 43.6562 18.4688 38.3438C18.4688 33.0938 15.125 29.5625 10.0625 29.5625C7.6875 29.5625 5.71875 30.3125 4.25 31.6875C5.375 19.9375 10.6875 11.9375 17.0312 11.9062C24.25 11.875 30.125 22.0312 30.125 36.4375C30.125 50.7812 24.25 60.9688 17.0312 61C11.5312 61.0312 6.78125 54.9688 4.90625 45.5938C6.28125 46.625 8.03125 47.1875 10.0625 47.1875ZM47.9688 47.1875C53 47.1875 56.4062 43.6562 56.4062 38.3438C56.4062 33.0938 53 29.5625 47.9688 29.5625C45.5938 29.5625 43.5938 30.3438 42.1562 31.6875C43.2812 19.9375 48.5938 11.9375 54.9688 11.9375C62.1562 11.9062 68 22.0938 68 36.4375C68 50.7812 62.1562 60.9688 54.9688 60.9688C49.4375 61 44.6875 54.9375 42.7812 45.5938C44.1562 46.5938 45.9375 47.1875 47.9688 47.1875ZM45.5312 37.4062C44.4375 37.25 43.75 35.9688 44.0312 34.6562C44.3125 33.3125 45.3125 32.3438 46.375 32.5312C47.4688 32.75 48.0938 34.0312 47.8438 35.3125C47.5938 36.6562 46.5938 37.5938 45.5312 37.4062ZM7.625 37.4062C6.53125 37.25 5.84375 35.9688 6.09375 34.6562C6.375 33.3125 7.40625 32.3438 8.4375 32.5312C9.5625 32.7812 10.1875 34.0312 9.9375 35.3125C9.6875 36.6562 8.65625 37.5938 7.625 37.4062Z" />
                                </svg>
                                <Text c="dimmed" fw="500">
                                    This content doesn't exist
                                </Text>
                                <Button onClick={() => navigate('/')}>Go back to home</Button>
                            </Flex>
                        </Center>
                    </Box>
                ) : (
                    <>
                        <CourseControls data={data} isLoading={isLoading} user={user} userReview={userReview}></CourseControls>
                        <Box className={classes.courseContent}>
                            <Flex className={clsx(classes.courseBanner, 'children-animation')}>
                                <Box className={classes.image}>
                                    <Skeleton radius="lg" mah={90} w={280} h={100} loading={isLoading} component={<Image radius="lg" h={100} mah={90} w={280} fit="contain" fallbackSrc={tumLogo} />} />
                                </Box>
                                <Flex className={classes.courseDetails} direction="column" gap="xs">
                                    <Skeleton
                                        h={37}
                                        width={300}
                                        radius="lg"
                                        loading={isLoading}
                                        component={
                                            <Text data-testid="course-name" style={{ wordBreak: 'break-word' }} fz={24} fw="700" lineClamp={5}>
                                                {data?.name}{' '}
                                            </Text>
                                        }
                                    />
                                    <Flex gap="xs" wrap="wrap">
                                        <Skeleton
                                            w={180}
                                            h={26}
                                            radius="lg"
                                            loading={isLoading}
                                            component={
                                                <Badge leftSection={<IconAlien width={16} />} variant="light" onClick={() => navigate(`/?search=${data.professor}`)} size="lg">
                                                    {data?.professor}{' '}
                                                </Badge>
                                            }
                                        />
                                        {data?.offeredInSemesters.map((semester, index) => (
                                            <Badge key={semester + index} leftSection={<IconCalendarMonth width={16} />} variant="light" color="lime.9" size="lg">
                                                {semester}{' '}
                                            </Badge>
                                        ))}
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex mt="xl" direction="column" className="children-animation" style={{ background: 'var(--mantine-color-body)' }}>
                                <Flex align="center" gap="xs" mb="lg">
                                    <Box bg="blue" w={10} h={30} style={{ borderRadius: '8px' }} />
                                    <Text fw="bold" fz="xl">
                                        Key Statistics
                                    </Text>
                                </Flex>
                                <Flex gap="lg" wrap="wrap">
                                    <HowEasyRating isLoading={isLoading} score={data?.howEasyRatingAverage} />
                                    <HowInterestingRating isLoading={isLoading} score={data?.howInterestingRatingAverage} />
                                    <ReviewsBox isLoading={isLoading} votes={data?.votesNumber} />
                                </Flex>
                            </Flex>
                            <Flex style={{ flexGrow: 1, background: 'var(--mantine-color-body)' }} pt="xl" direction="column" className="children-animation">
                                <Flex justify="space-between" align="center" mb="lg">
                                    <Flex align="center" gap="xs">
                                        <Box bg="blue" w={10} h={30} style={{ borderRadius: '8px' }} />
                                        <Text fw="bold" fz="xl">
                                            Reviews
                                        </Text>
                                    </Flex>
                                    <Box hiddenFrom="sm">
                                        {user ? (
                                            userReview ? (
                                                <Button loading={isLoading} size="sm" variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 170 }} color="green" onClick={() => navigate(getPath(Paths.editUserReview))} leftSection={<IconEditCircle style={{ width: rem(16), height: rem(16) }} />}>
                                                    Edit your review
                                                </Button>
                                            ) : (
                                                <Button loading={isLoading} size="sm" variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} onClick={() => navigate(getPath(Paths.addUserReview))} leftSection={<IconCirclePlus style={{ width: rem(16), height: rem(16) }} />}>
                                                    Add review
                                                </Button>
                                            )
                                        ) : (
                                            <>
                                                <Button loading={isLoading} size="sm" variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} onClick={() => navigate(getPath(Paths.signIn))}>
                                                    Sign In to add review
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Flex>
                                <Box>
                                    <Flex direction="column" mih="300" gap="xs">
                                        {userReview ? (
                                            <>
                                                <Comment userReview={userReview} {...userReview} />
                                                <Divider my="xs" />
                                            </>
                                        ) : null}
                                        {reviews?.map((review, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    <Comment userReview={false} {...review} />
                                                </Fragment>
                                            );
                                        })}
                                        {!reviews?.length && !userReview ? (
                                            <Text ml="lg" size="xl" fw="bold" c="dimmed">
                                                No reviews yet
                                            </Text>
                                        ) : null}
                                    </Flex>
                                </Box>
                            </Flex>
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
};

export { Course };
