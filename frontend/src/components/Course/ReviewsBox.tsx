import {Box, Flex, Text} from "@mantine/core";
import {IconUsersGroup} from "@tabler/icons-react";


interface ReviewsBoxProps {
    votes:number
}

const ReviewsBox = (props:ReviewsBoxProps) => {
    const {votes} = props;
    let color =  votes ? "black" : "gray"
    return (
        <Flex  direction="column" px="md" py="md" align="flex-start" pos="relative" style={{
            borderRadius: "16px",
            minWidth: "200px",
            minHeight: "157px",
            background: "var(--primary-light-gradient)",
            position: "relative",
            overflow: "hidden"
        }}>
            <Flex align="center" gap={6}>
                <Box w={7} h={20} style={{
                    borderRadius: "8px",
                    background: `var(--mantine-color-text)`
                }}/>
                <Text mt={1} fw="bold">Number of reviews</Text>
            </Flex>
            <Flex mt="3" direction="column" px={12}>
                <Flex align="center">
                    <Text mr="xs" c={color} fz="34" fw="bold">{votes}</Text>
                    <IconUsersGroup strokeWidth="2" width={40} height={40} style={{
                        fill: "var(--mantine-color-dimmed)",
                        stroke: color
                    }}/>
                </Flex>
            </Flex>
        </Flex>
    )
}

export {ReviewsBox}