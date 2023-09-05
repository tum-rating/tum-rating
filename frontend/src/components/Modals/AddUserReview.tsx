import {useForm} from '@mantine/form';
import {Button, Flex, Paper, Textarea} from '@mantine/core';
// eslint-disable-next-line import/named
import {ContextModalProps, modals} from '@mantine/modals';
import {useAddUserReview, UserAddReviewInput} from "../../reviews/useAddUserReview";
import {HowEasyRating, HowInterestingRating} from "../Ratings";
import {useEffect} from "react";

const openAddUserReviewModal = (courseId: string, userReview?: any) => {
    modals.openContextModal({
        modal: 'addUserReview',
        title: 'Add review',
        innerProps: {
            courseId,
            userReview
        },
    });
};
const AddUserReviewModal = ({context, id, innerProps}: ContextModalProps<{
    courseId: string,
    userReview: any
}>) => {
    const {courseId, userReview} = innerProps
    const {addUserReview, status} = useAddUserReview(courseId)

    useEffect(() => {
        if (status === 'success') {
            context.closeModal(id)
        }
    }, [status])


    useEffect(() => {
        console.log(userReview)
        if (userReview) {
            const {howEasyRating, howInterestingRating, comment} = userReview
            form.setFieldValue('howEasyRating', howEasyRating)
            form.setFieldValue('howInterestingRating', howInterestingRating)
            form.setFieldValue('comment', comment)
        }
    }, []);


    const form = useForm({
        initialValues: {
            howInterestingRating: 0,
            howEasyRating: 0,
            comment: "",
        },
    });

    const onAddUserReview = (form: UserAddReviewInput) => {
        console.log(form)
        if (form.howInterestingRating === 0 || form.howEasyRating === 0) return
        addUserReview({...form})
    }

    return (
        <Paper radius="md" p="xl">
            <form
                onSubmit={form.onSubmit((e) => {
                    onAddUserReview(e);
                })}
            >
                <Flex align="center" justify="center" mb={12}>
                    Your review
                </Flex>
                <Flex w="100%" justify="space-around" align="center">
                    <HowEasyRating onChange={(value) => form.setFieldValue('howEasyRating', value)}
                                   initialScore={form.values.howEasyRating}/>
                    <HowInterestingRating onChange={(value) => form.setFieldValue('howInterestingRating', value)}
                                          initialScore={form.values.howInterestingRating}/>
                </Flex>
                <Textarea
                    mt={24}
                    placeholder="Your comment"
                    label="Your comment"
                    value={form.values.comment}
                    onChange={(event) => form.setFieldValue('comment', event.currentTarget.value)}
                />
                <Flex mt={12} justify="space-between">
                    <Button onClick={close} color={'gray'} variant={'subtle'}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={close}>Send</Button>
                </Flex>
            </form>
        </Paper>
    );
};

export {AddUserReviewModal, openAddUserReviewModal};
