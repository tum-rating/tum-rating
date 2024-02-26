import {Flex, Text} from "@mantine/core";


interface RatingProps {
    initialScore?: number;
    label?: string;
}


const green = "linear-gradient(90deg, var(--mantine-color-green-filled) 0%, var(--mantine-color-lime-filled) 100%)"
const red = "linear-gradient(90deg, var(--mantine-color-red-filled) 0%, var(--mantine-color-orange-filled) 100%);"
const Rating = ({initialScore}: RatingProps) => {
    return (
        <Flex direction="column" justify="center" align="center" style={{
            borderRadius: "16px",
            background: "linear-gradient(90deg, rgb(145 167 255 / 20%) 0%, rgb(77 171 247 / 20%) 100%)",
            width: "200px",
            height: "140px"
        }}>
            <Flex justify="center" align="center" gap="xs">
                <Text fz="34" fw="bold">{initialScore}</Text>
            </Flex>
            <Text>How easy</Text>
        </Flex>
    )
}


export {Rating, RatingProps}