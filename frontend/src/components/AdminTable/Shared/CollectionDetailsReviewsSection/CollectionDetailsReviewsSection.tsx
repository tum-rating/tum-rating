import {Button, Divider, Flex, Text} from '@mantine/core';

import {Review} from '@/admin/types.ts';
import {PaginatedReviewsConfig, useReviews} from '@/admin/useReviews.ts';
import classes from '@/components/AdminTable/Shared/styles/ExpansionStyles.module.css';
import {Comment} from '@/components/Comment';
import {Skeleton} from '@/components/Skeleton';
import {getPath, Paths} from '@/routes/paths.ts';

const CollectionDetailsReviewsSection = (config: PaginatedReviewsConfig) => {
    const {data: reviews, isLoading: reviewsLoading} = useReviews({
        ...config,
    });

    return (
        <Flex direction="column" gap="xs" className={classes.expansionDetails}>
            <Flex align="center" gap="xs" wrap="wrap">
                <Text fz="sm" fw={500}>
                    Reviews
                </Text>
            </Flex>
            <Divider variant="dashed" size="sm" />
            <Flex direction="column" gap="xs">
                <Flex justify="flex-start" gap="xs" wrap="wrap">
                    <Flex align="center" gap="3">
                        <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
                            Total Reviews:{' '}
                        </Text>
                        <Skeleton
                            width={155}
                            height={16}
                            radius="sm"
                            loading={reviewsLoading}
                            component={
                                <Text truncate fz="xs" fw="600" c="dimmed">
                                    {reviews?.pages[0].results?.length}
                                </Text>
                            }
                        ></Skeleton>
                    </Flex>
                </Flex>
            </Flex>
            {reviews?.pages[0].results?.map((review: Review, index: number) => (
                <>
                    {config.userId && (
                        <Flex align='flex-end'>
                            <Text style={{whiteSpace: 'nowrap'}} fz="xs" c="dimmed" fw="bold" mr="2"># {index}</Text>
                            <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
                                Course ID:{' '}
                            </Text>
                            <Button
                                px={4}
                                m={0}
                                h={20}
                                variant="subtle"
                                fz="xs"
                                fw="600"
                                c={'blue'}
                                onClick={() => {
                                    const dynamicPath = getPath(Paths.adminCoursesDetails).replace(':adminCourseId', review.courseId);
                                    window.open(dynamicPath, '_blank');
                                }}
                            >
                                {review.courseId}
                            </Button>
                        </Flex>
                    )}
                    <Comment
                        userReview={{
                            userId: '',
                        }}
                        {...review}
                        key={review.id}
                    />
                </>
            ))}
        </Flex>
    );
};

export {CollectionDetailsReviewsSection};
