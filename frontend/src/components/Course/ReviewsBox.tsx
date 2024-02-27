import {Box, Flex, Text} from "@mantine/core";
import {IconUsersGroup} from "@tabler/icons-react";
import classes from "./RatingBox.module.css"

interface ReviewsBoxProps {
    votes:number
}

const ReviewsBox = (props:ReviewsBoxProps) => {
    const {votes} = props;
    let color =  votes ? "black" : "gray"
    return (
        <Flex className={classes.ratingBox}  direction="column" px="md" py="md" align="flex-start" pos="relative">
            <Flex align="center" gap={6}>
                <Box w={7} h={20} style={{
                    borderRadius: "8px",
                    background: `var(--mantine-color-text)`
                }}/>
                <Text mt={1} fw="bold">Number of reviews</Text>
            </Flex>
            <Flex mt="3" direction="column" px={12}>
                <Flex align="center">
                    <Text mr="xs" fz="34" fw="bold" style={{
                        color: votes ? "var(--mantine-color-text)" : "var(--mantine-color-gray-text)"
                    }}>{votes}</Text>
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