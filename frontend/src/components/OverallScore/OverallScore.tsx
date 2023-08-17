import { Card, Flex, Badge } from '@mantine/core';
import { HowEasyRating, HowInterestingRating, OverallRating } from '../Ratings';
interface OverallScoreProps {
  score: number;
  numberOfReviews: number;
  howInteresting: number;
  howEasy: number;
}
export const OverallScore = (props: OverallScoreProps) => {
  const { score } = props;
  return (
    <Card w={'100%'} shadow="sm" padding="lg" radius="md" withBorder>
      <Flex align="center" justify="center" mb={12}>
        Review based on <Badge mx={6}>342</Badge> reviews
      </Flex>
      <Flex w="100%" justify="space-around" align="center">
        <OverallRating readonly initialScore={score} />
        <HowEasyRating readonly initialScore={score} />
        <HowInterestingRating readonly initialScore={score} />
      </Flex>
    </Card>
  );
};
