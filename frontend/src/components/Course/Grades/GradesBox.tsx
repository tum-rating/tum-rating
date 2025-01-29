import {FormatedExamStats} from "@/components/Course/Course.tsx";
import {ActionIcon, Badge, Flex, Text} from "@mantine/core";
import classes from './GradesBox.module.css';
import '@mantine/charts/styles.css';
import {IconChevronRight, IconUsers} from "@tabler/icons-react";
import clsx from "clsx";
import { BarChart } from '@mantine/charts';

// export declare class ExamStats {
//     peopleTotal: number;COU
//     attemptsTotal: number;
//     peopleAttemptsFailed: number;
//     attemptsFailedPercentage: number;
//     averageAttemptsTotal: number;
//     averageAttemptsPassed: number;
//     grades: {
//         grade: ExamGrade;
//         people: number;
//     }[];
// }

// [
//     {
//         "grade": "1.0",
//         "people": 90
//     },
//     {
//         "grade": "1.3",
//         "people": 999
//     },
//     {
//         "grade": "1.7",
//         "people": 23
//     },
//     {
//         "grade": "2.0",
//         "people": 30
//     },
//     {
//         "grade": "2.3",
//         "people": 30
//     },
//     {
//         "grade": "2.7",
//         "people": 37
//     },
//     {
//         "grade": "3.0",
//         "people": 38
//     },
//     {
//         "grade": "3.3",
//         "people": 35
//     },
//     {
//         "grade": "3.7",
//         "people": 41
//     },
//     {
//         "grade": "4.0",
//         "people": 19
//     },
//     {
//         "grade": "4.3",
//         "people": 24
//     },
//     {
//         "grade": "4.7",
//         "people": 22
//     },
//     {
//         "grade": "5.0",
//         "people": 6
//     },
//     {
//         "grade": "6.0",
//         "people": 36
//     }
// ]
const GradesBox = (props: FormatedExamStats) => {



    return (
        <Flex className={classes.gradesBox} direction="column" px="md" py="md" align="flex-start" pos="relative">
            <Flex align='center' gap={10} w={'100%'}>
                <Text mt={1} fw="bold">
                    {props.semester}
                </Text>
                <Badge
                    size="md"
                    variant="gradient"
                    gradient={props.examType === "retake" ? {from: 'yellow', to: 'orange', deg: 90} : {
                        from: 'indigo',
                        to: 'blue',
                        deg: 90
                    }}
                >
                    {props.examType}
                </Badge>
                <ActionIcon variant={'subtle'} ml={'auto'}>
                    <IconChevronRight size={24}/>
                </ActionIcon>
            </Flex>
            <Flex gap={12}>
                <Flex direction={'column'} className={clsx(classes.highlightCard, classes.highlightBlueToIndigo)}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18}/>
                        <Text className={classes.highlightCardTitle}>
                            Total participants
                        </Text>
                    </Flex>
                    <Text className={classes.highlightCardValue}>
                        {props.peopleTotal}
                    </Text>
                </Flex>
                <Flex direction={'column'} className={clsx(classes.highlightCard, classes.highlightBlueToIndigo)}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18}/>
                        <Text className={classes.highlightCardTitle}>
                            Pass Rate
                        </Text>
                    </Flex>
                    <Text className={classes.highlightCardValue}>
                        {props.attemptsFailedPercentage}%
                    </Text>
                </Flex>
                <Flex direction={'column'} className={clsx(classes.highlightCard, classes.highlightBlueToIndigo)}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18}/>
                        <Text className={classes.highlightCardTitle}>
                            Avg. Grade
                        </Text>
                    </Flex>
                    <Text className={classes.highlightCardValue}>
                        {
                            props.averageAttemptsPassed === 0 ? "N/A" : props.averageAttemptsPassed
                        }
                    </Text>
                </Flex>
            </Flex>
            <Flex direction={'column'}>
                <Text mt={24} mb={32} fw="bold" fz={'sm'}>
                    Grades Distribution
                </Text>
                <BarChart
                    h={200}
                    w={500}
                    data={props.grades}
                    dataKey={'grade'}
                    series={[{
                        name: "people",
                        color: 'blue',
                    }]}
                />
            </Flex>
        </Flex>
    );
}
export {GradesBox};
