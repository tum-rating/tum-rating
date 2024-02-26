
import {RatingProps,Rating} from "@/components/Course/Rating.tsx";
import {Box, Flex, Text} from "@mantine/core";

interface HowEasyRatingProps {
    initialScore?: number;
}

const HowEasyRating = (props:HowEasyRatingProps) => {
    const {initialScore} = props;
    return (
        <Flex direction="column" p="md" align="flex-start"  style={{
            borderRadius: "16px",
            background: "linear-gradient(90deg, rgb(145 167 255 / 20%) 0%, rgb(77 171 247 / 20%) 100%)",
            width: "200px",
            height: "150px"
        }}>
            <Flex align="center" mb={6} gap={8}>
                <Box bg="red" w={7} h={20} style={{borderRadius: "8px"}}/>
                <Text fw="bold" >How Easy</Text>
            </Flex>
            <Flex direction="column" px={14}>
                <Flex>
                    <Text fz="34" fw="bold">{initialScore}</Text>
                </Flex>
                <Text>Moderate</Text>
            </Flex>
        </Flex>
    )
}

export {HowEasyRating}