import '@mantine/core/styles.css';
import {
    Affix,
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Image,
    rem,
    Text,
} from '@mantine/core';
import classes from './Course.module.css';
import {
    IconAlien,
    IconCalendarMonth,
    IconCirclePlus,
    IconEditCircle,
} from '@tabler/icons-react';
import {Comment} from '@/components/Comment';
import {useNavigate, useParams} from 'react-router-dom';
import {useUser} from '@/auth/useUser.tsx';
import {useDetailReview} from '@/reviews/useReview.tsx';
import {getPath, Paths} from '@/routes/paths.ts';
import {isMobile} from "react-device-detect";
import {CourseControls} from "./CourseControls.tsx";
import {HowEasyRating} from "@/components/Course/HowEasyRating.tsx";
import {HowInterestingRating} from "@/components/Course/HowInterestingRating.tsx";
import clsx from "clsx";
import {Fragment, useEffect} from "react";
import {ReviewsBox} from "@/components/Course/ReviewsBox.tsx";

const Course = () => {
    const {id} = useParams();
    const {user} = useUser();
    const navigate = useNavigate();
    const {data, isFetching} = useDetailReview(id || '');
    useEffect(() => {
        const children = document.querySelectorAll('.children-animation > *');
        children.forEach((child: Element, index: number) => {
            (child as HTMLElement).style.animationDelay = `${0.025 * (index + 1)}s`;
        });
    }, []);

    let userReview = null
    let reviews = data?.reviews;

    if (user) {
        userReview = reviews?.find(review => review.userId === user.user.id);
        reviews = reviews?.filter(review => review.userId !== user.user.id);
    }


    return (
        <Box className={classes.container}>
            <CourseControls data={data} isFetching={isFetching} user={user} userReview={userReview}></CourseControls>
            <Box className={classes.courseContent}>
                <Flex className={clsx(classes.courseBanner, "children-animation")}>
                    <Image className={classes.image} my={16} h={100} mah={90} w={280} fit="contain"
                           fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                           src="https://fordemocracy.de/wp-content/uploads/2019/08/TUM_Logo_extern_DE_blau_WEB.png"/>
                    <Flex direction="column" gap={0}>
                        <Text ml="md" pt="xs" fz={rem(24)} fw="700" lineClamp={5}>
                            {data?.course}{' '}
                        </Text>
                        <Flex ml="md" mt="xs" gap="xs">
                            <Badge
                                leftSection={<IconAlien width={16}/>}
                                autoContrast
                                variant="light"
                                onClick={() => navigate(`/?search=${data.professor}`)}
                                size="lg"

                            >
                                {data?.professor}{' '}
                            </Badge>
                            {data?.offeredInSemesters.map((semester) => (
                                <Badge
                                    leftSection={<IconCalendarMonth width={16}/>}
                                    autoContrast
                                    variant="light"
                                    color="lime.9"
                                    size="lg">
                                    {semester}{' '}
                                </Badge>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
                <Flex mt="xl" direction="column" className="children-animation">
                    <Flex align="center" gap="xs" mb="lg">
                        <Box bg="blue" w={10} h={30} style={{borderRadius: "8px"}}/>
                        <Text fw="bold" fz="24">Key Statistics</Text>
                    </Flex>
                    <Flex gap="lg" wrap="wrap">
                        <HowEasyRating score={data?.howEasyRatingAverage}/>
                        <HowInterestingRating score={data?.howInterestingRatingAverage}/>
                        <ReviewsBox votes={data?.votesNumber}/>
                    </Flex>
                </Flex>
                <Flex style={{flexGrow: 1}} mb="100" mt="xl" direction="column" className="children-animation">
                    <Flex align="center" gap="xs" mb="lg">
                        <Box bg="blue" w={10} h={30} style={{borderRadius: "8px"}}/>
                        <Text fw="bold" fz="24">Reviews</Text>
                    </Flex>
                    <Box>
                        <Flex direction="column" mih="300" gap="xl">
                            {
                                userReview ? (
                                    <Comment userReview={userReview} {...userReview}/>
                                ) : null
                            }
                            {
                                reviews?.map((review, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Comment userReview={false} {...review}/>
                                                 {index !== reviews.length - 1 && <Divider my="md"/>}
                                        </Fragment>
                                    );
                                })
                            }
                            {
                                !reviews?.length && !userReview ?
                                    <Text size="xl" fw="bold" c="dimmed">No reviews yet</Text> : null
                            }
                        </Flex>
                    </Box>
                </Flex>
                <Affix className={classes.courseMobileAffix} position={{bottom: 15, right: 20}}>
                    {user ? (
                        userReview ? (
                            <Button size={isMobile ? "md" : "sm"} variant="gradient"
                                    className={classes.courseMobileAffixButtons}
                                    gradient={{from: 'teal', to: 'lime', deg: 170}} color="green"
                                    onClick={() => navigate(getPath(Paths.editUserReview))}
                                    leftSection={<IconEditCircle style={{width: rem(16), height: rem(16)}}/>}>
                                Edit your review
                            </Button>
                        ) : (
                            <Button size={isMobile ? "md" : "sm"} variant="gradient"
                                    className={classes.courseMobileAffixButtons}
                                    gradient={{from: 'indigo', to: 'blue', deg: 90}}
                                    onClick={() => navigate(getPath(Paths.addUserReview))}
                                    leftSection={<IconCirclePlus style={{width: rem(16), height: rem(16)}}/>}>
                                Add review
                            </Button>
                        )
                    ) : (
                        <>
                            <Button size={isMobile ? "md" : "sm"} variant="gradient"
                                    className={classes.courseMobileAffixButtons}
                                    gradient={{from: 'indigo', to: 'blue', deg: 90}}
                                    onClick={() => navigate(getPath(Paths.signIn))}>
                                Sign In to add review
                            </Button>
                        </>
                    )}
                </Affix>
            </Box>
        </Box>
    )
};

export {Course};
