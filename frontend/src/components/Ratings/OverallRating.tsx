import { RatingProps } from './types';
import { Badge, Flex, Rating, Stack, Text } from '@mantine/core';
import { useState } from 'react';
interface OverallRatingProps extends RatingProps {}

export const OverallRating = (props: OverallRatingProps) => {
  const { initialScore = 0, readonly = false } = props; // Use initialScore and readonly props
  const [score, setScore] = useState(initialScore);

  let message = '';
  if (score >= 0 && score < 2) {
    message = 'Poor';
  } else if (score >= 2 && score < 4) {
    message = 'Average';
  } else if (score >= 4 && score <= 5) {
    message = 'Excellent';
  }

  return (
    <Stack align="center" spacing="0">
      <Text weight={500}>Overall Rating</Text>
      <Flex gap={10} align="center">
        <Text fz={36} weight={500}>
          {score}
        </Text>
        <Text>/ 5</Text>
      </Flex>
      <Rating
        mb={10}
        value={score}
        fractions={2}
        readOnly={readonly}
        onChange={(value) => (readonly ? null : setScore(value))}
      />
      <Badge color={message === 'Poor' ? 'red' : message === 'Average' ? 'yellow' : 'green'}>{message}</Badge>
    </Stack>
  );
};
