import { Badge, Card, Flex } from '@mantine/core';
import { HowEasyRating, HowInterestingRating } from '../Ratings';

interface OverallScoreProps {
    numberOfReviews: number;
    howInteresting: number;
    howEasy: number;
}

export const OverallScore = (props: OverallScoreProps) => {
    const { numberOfReviews, howInteresting, howEasy } = props;
    return (
        <Card w={'100%'} shadow="sm" padding="lg" radius="md" withBorder>
            <Flex align="center" justify="center" mb={24}>
                Review based on <Badge mx={6}>{numberOfReviews}</Badge> reviews
            </Flex>
            <Flex w="100%" justify="space-around" align="center">
                <HowEasyRating readonly initialScore={howEasy} />
                <HowInterestingRating readonly initialScore={howInteresting} />
            </Flex>
        </Card>
    );
};
