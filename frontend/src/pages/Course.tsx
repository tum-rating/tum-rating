import {
    Anchor,
    Box,
    Breadcrumbs,
    Button,
    createStyles,
    Divider,
    Flex,
    keyframes,
    LoadingOverlay,
    Skeleton,
    Stack,
    Text,
    Title
} from '@mantine/core';
import {useNavigate, useParams} from "react-router-dom";
import {useDetailReview} from "../reviews/useReview";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {OverallScore} from "../components/OverallScore";
import {Comment} from "../components/Comment";
import {openAddUserReviewModal} from "../components/Modals/AddUserReview";
import {useUser} from "../auth/useUser";
import {useEffect, useState} from "react";


const fadeIn = keyframes({
    '0%': {
        filter: 'opacity(0)',
    },
    '100%': {
        filter: 'opacity(1)',
    }
})

const useStyles = createStyles((theme) => ({
    courseContainer: {
        padding: ' 30px 60px 30px 60px',
        alignItems: 'center',
        position: 'relative',
        borderLeft: '0.0625rem solid #e9ecef',
        borderRight: '0.0625rem solid #e9ecef',
        borderColor: theme.colorScheme === 'dark' ? '#2C2E33' : '#e9ecef',
        background: theme.colorScheme === 'dark' ? '#1A1B1E' : theme.white,
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        width: '630px',
        [theme.fn.smallerThan('sm')]: {
            padding: '12px 0 24px 0',
            width: "100%"
        },
    },


    datesContainer: {
        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            ".dot": {
                display: 'none'
            }
        },
    },

    opacity: {
        position: 'absolute',
        inset: 0,
        opacity: .88,
        background: theme.colorScheme === 'dark' ? theme.black : theme.white,
    },
    courseHeading: {
        width: '100%',
        maxWidth: '780px',
        gap: 0,
        marginBottom: '20px'
    },
    courseRating: {
        width: '100%',
        maxWidth: '780px',
        flexGrow: 1
    }
}))


const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
};

export const Course = () => {
    const {id} = useParams()
    const [autoAnimateParent] = useAutoAnimate();
    const {classes} = useStyles()
    const {user} = useUser()
    const {review, status} = useDetailReview(id)
    const navigate = useNavigate()
    const [userReview, setUserReview] = useState<any>(null)
    useEffect(() => {
        if (review) {
            const myReview = review.reviews.find(review => review.userId === user?.user.id)
            setUserReview(myReview)
        }

    }, [review])
    if (!id) return 'error'
    if (!review) return (
        <Stack sx={{animation: `${fadeIn} 0.1s ease-in-out`}} className={classes.courseContainer}>
            <LoadingOverlay w='100%' visible={!review} overlayBlur={2}/>
        </Stack>
    )

    const {
        professor,
        course,
        courseNumber,
        createdAt,
        updatedAt,
        howInterestingRatingAverage,
        howEasyRatingAverage,
        votesNumber,
        reviews: reviewComments,
        _id
    } = review


    const userComment = reviewComments.find(comment => comment.userId === user.user.id);
    const otherComments = reviewComments.filter(comment => comment.userId !== user.user.id);

    return (
        <Stack className={classes.courseContainer}>
            <Box w='100%'>
                <Stack className={classes.courseHeading}>
                    <Breadcrumbs mb='md' w='100%'>
                        <Anchor fz='xs' href={"/"} onClick={(e) => {
                            e.preventDefault()
                            navigate(-1)
                        }} key={'home'}>
                            Home
                        </Anchor>
                        <Anchor fz='xs' w={400} href="#" key={courseNumber}>
                            <Text truncate m={0} p={0}>
                                {course}
                            </Text>
                        </Anchor>
                    </Breadcrumbs>
                    <Title order={1}>
                        {status === "loading" ? (
                            <Skeleton visible={true} width={200} height={30}/>
                        ) : (
                            <>{course}</>
                        )}
                    </Title>
                    <Flex className={classes.datesContainer} gap={10} mb='xs'>
                        <Text size="xs" color="dimmed">
                            created:
                            <Text ml={5} component='span'
                                  c='black'>{new Date(createdAt).toLocaleString("en-US", options as any)}</Text>
                        </Text>
                        <Text size="xs" color="dimmed" className='dot'>
                            •
                        </Text>
                        <Text size="xs" color="dimmed">
                            last updated:
                            <Text ml={5} component='span'
                                  c='black'>{new Date(updatedAt).toLocaleString("en-US", options as any)}</Text>
                        </Text>
                    </Flex>
                    <Divider color='blue' size="xl" mb='xs'/>
                    <Text fz='xs'>
                        Main Professor:
                        <Anchor fz='md' fw={600} ml={6} target="_blank">
                            {professor}
                        </Anchor>
                    </Text>
                    <Text fz='xs'>
                        Course Number:
                        <Anchor fz='md' fw={600} ml={6} target="_blank">
                            {courseNumber}
                        </Anchor>
                    </Text>
                </Stack>
                <Stack className={classes.courseRating}>
                    <OverallScore numberOfReviews={votesNumber} howInteresting={howInterestingRatingAverage}
                                  howEasy={howEasyRatingAverage}/>
                    <Stack ref={autoAnimateParent}>
                        {userReview ?
                            <Button color='green' onClick={() => openAddUserReviewModal(_id, userReview)}>Edit your
                                review</Button> :
                            <Button onClick={() => openAddUserReviewModal(_id)}>Add review</Button>}
                        {!reviewComments.length && <Text>No comments yet</Text>}
                        {userComment && <Comment key={userComment._id} {...userComment} />}
                        {otherComments.map((comment) => {
                            return <Comment key={comment._id} {...comment} />;
                        })}
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    );
};
