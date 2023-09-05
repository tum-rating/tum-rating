import {
    createStyles,
    Text,
    Avatar,
    TypographyStylesProvider,
    Paper,
    Rating,
    Flex,
    Spoiler
} from '@mantine/core';
import {useUser} from "../../auth/useUser";
const useStyles = createStyles((theme) => ({
    comment: {
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    },
    body: {
        paddingTop: 5,
        fontSize: theme.fontSizes.sm,
    },
    content: {
        '& > p:last-child': {
            marginBottom: 0,
        },
    },
}));

interface CommentProps {
    comment: string;
    createdAt: string;
    howEasyRating: number;
    howInterestingRating: number;
    userId: string;
    _id: string;
}

export const Comment = ({comment, userId, howEasyRating, howInterestingRating}: CommentProps) => {
    const {user} = useUser()
    const {classes} = useStyles();
    return (
        <Paper withBorder radius="md" className={classes.comment}>
            <Flex align='flex-start' gap={10}>
                <Avatar alt={userId} radius="xl"/>
                <Flex direction='column' mt={6} gap={5} h='100%' justify='center'>
                    <Text fz="sm">{userId} {userId === user.user.id ? '(Your comment)' : ''}</Text>
                    <Flex gap={10}>
                        <Flex align='center' gap={5}>
                            <Text fz='xs' mr={3} color='dimmed'>How interesting</Text>
                            <Rating
                                size="12px"
                                value={howInterestingRating}
                                fractions={2}
                                readOnly
                            />
                        </Flex>
                        <Flex align='center' gap={5}>
                            <Text fz='xs' mr={3} color='dimmed'>How easy</Text>
                            <Rating
                                size="12px"
                                value={howEasyRating}
                                fractions={2}
                                readOnly
                            />
                        </Flex>
                    </Flex>
                    <TypographyStylesProvider className={classes.body}>
                        <Spoiler maxHeight={40} showLabel="Show more" hideLabel="Hide" transitionDuration={0}>
                            <div className={classes.content} dangerouslySetInnerHTML={{__html: comment}}/>
                        </Spoiler>
                    </TypographyStylesProvider>
                </Flex>
            </Flex>
        </Paper>
    )
};
