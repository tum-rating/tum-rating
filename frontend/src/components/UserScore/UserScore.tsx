import {Card,Flex,Textarea} from "@mantine/core";
import {HowEasyRating, HowInterestingRating} from "../Ratings";


interface UserScoreProps {
    howInteresting: number;
    howEasy: number;
}

export const UserScore = (props: UserScoreProps) => {
    const {howInteresting = 0,howEasy=0} = props;
    return (
        <Card w={"100%"} shadow="sm" padding="lg" radius="md" withBorder>
            <Flex align="center" justify="center" mb={12}>
                Your review
            </Flex>
            <Flex  w="100%" justify="space-around" align="center">
                <HowEasyRating initialScore={howEasy}/>
                <HowInterestingRating initialScore={howInteresting}/>
            </Flex>
            <Textarea
                mt={24}
                placeholder="Your comment"
                label="Your comment"
            />
        </Card>
    );
};