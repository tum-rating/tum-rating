import { Badge, Flex, Rating, Text } from '@mantine/core';

import { RatingBoxProps } from '@/components/Course/RatingBox.tsx';

interface EditableRatingBoxProps extends RatingBoxProps {
    onChange?: (value: number) => void;
}

const EditableRatingBox = (props: EditableRatingBoxProps) => {
    const { score, message, color, label, onChange = (_: number) => false } = props;
    return (
        <Flex direction="column" align="flex-start" pos="relative">
            <Flex direction="column">
                <Flex align="center" gap={6} mb="4">
                    <Text mt={1} fw="500" fz="sm">
                        {label}
                    </Text>
                </Flex>

                <Rating
                    size="lg"
                    value={score}
                    fractions={2}
                    readOnly={false}
                    onChange={(value) => {
                        onChange(value);
                    }}
                />
            </Flex>
            <Flex mt="3" align="center" gap={6}>
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
