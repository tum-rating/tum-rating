import { Badge, Flex, Rating, Text } from '@mantine/core';

import { RatingBoxProps } from '@/components/Course/RatingBox.tsx';

interface EditableRatingBoxProps extends RatingBoxProps {
    onChange?: (value: number) => void;
}

const EditableRatingBox = (props: EditableRatingBoxProps) => {
    const { score, message, color, label, onChange = (_: number) => false } = props;

    return (
        <Flex direction="column" align="center" justify="center" pos="relative">
            <Text mt={1} fw="500" fz="sm" mb="4">
                {label}
            </Text>
            <Rating
                size="xl"
                value={score}
                visibleFrom="xs"
                fractions={2}
                readOnly={false}
                onChange={(value) => {
                    onChange(value);
                }}
            />
            <Rating
                size="45"
                value={score}
                hiddenFrom="xs"
                fractions={2}
                readOnly={false}
                onChange={(value) => {
                    onChange(value);
                }}
            />
            <Flex mt="3" align="center" gap={6} justify="center" w="100%">
                <Flex mt={2}>
                    <Text c={color} fz="xl" fw="bold">
                        {score}
                    </Text>
                </Flex>
                <Badge mt={2} radius="md" variant="filled" size="md" color={color}>
                    {message}
                </Badge>
            </Flex>
        </Flex>
    );
};

export { EditableRatingBox, EditableRatingBoxProps };
