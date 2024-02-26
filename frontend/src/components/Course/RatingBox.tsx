import {Badge, Box, Flex, Rating, Text} from "@mantine/core";


interface RatingBoxProps {
    label: string;
    score: number;
    message: string;
    color: string;
    readOnly?: boolean;
    onChange?: (value: number) => void;
}

const RatingBox = (props: RatingBoxProps) => {
    const {score, message, color, label, readOnly = true, onChange = (_:number) => false} = props;
    return (
        <Flex direction="column" px="md" py="md" align="flex-start" pos="relative" style={{
            borderRadius: "16px",
            maxWidth: "200px",
            maxHeight: "157px",
            minWidth: "175px",
            background: "var(--primary-light-gradient)",
            position: "relative",
            overflow: "hidden"
        }}>
            <Flex align="center" gap={6}>
                <Box w={7} h={20} style={{
                    borderRadius: "8px",
                    background: `var(--mantine-color-text)`
                }}/>
                <Text mt={1} fw="bold">{label}</Text>
            </Flex>
            <Flex mt="3" direction="column" px={12}>
                <Rating value={score} fractions={2} readOnly={readOnly} onChange={(value)=> {
                    onChange(value)
                }}/>
                <Flex>
                    <Text c={color} fz="34" fw="bold">{score}</Text>
                </Flex>
                <Badge radius="md" variant="light" autoContrast size="lg" color={color}>{message}</Badge>
            </Flex>
        </Flex>
    )
}

export {RatingBox,RatingBoxProps}