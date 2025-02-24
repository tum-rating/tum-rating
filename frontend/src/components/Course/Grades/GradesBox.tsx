import {FormatedExamStats} from '@/components/Course/Course.tsx';
import {Badge, Flex, Paper, Text} from '@mantine/core';
import classes from './GradesBox.module.css';
import '@mantine/charts/styles.css';
import {IconTargetOff, IconUsers} from '@tabler/icons-react';
import clsx from 'clsx';
import {hslToRGBA} from '@/utils/hslToRGBA';
import {BarChart} from '@mantine/charts';

const barColor = function (grade) {
    const v = Number(grade);
    if (v <= 4.0) {
        const hue = (4.0 - v) * 40.0;
        return `hsl(${hue}, 100%, 40%)`;
    } else if (v <= 5.0) {
        const hue = (5.0 - v) * 25.0 + 25.0;
        return `hsl(0, 100%, ${hue - 5}%)`;
    } else if (v >= 8.0) {
        return 'hsl(0, 100%, 40%)';
    } else if (v >= 7.0) {
        return 'hsl(120, 100%, 40%)';
    }
    return 'hsl(0, 0%, 45%)';
};

const GradesBox = (props: FormatedExamStats) => {
    const averageAttemptsTotalHighlightColor = barColor(props.averageAttemptsTotal);
    const averageAttemptsPassedHighlightColor = barColor(props.averageAttemptsPassed);

    return (
        <Flex className={classes.gradesBox} direction="column" px="md" py="md" align="flex-start" pos="relative">
            <Flex align="center" gap={10} w={'100%'}>
                <Text mt={1} fw="bold">
                    {props.semester}
                </Text>
                <Badge
                    size="md"
                    variant="gradient"
                    gradient={
                        props.examType === 'retake'
                            ? {from: 'yellow', to: 'orange', deg: 90}
                            : {
                                  from: 'indigo',
                                  to: 'blue',
                                  deg: 90,
                              }
                    }
                >
                    {props.examType}
                </Badge>
            </Flex>
            <Flex gap={12} mt={'lg'} wrap={'wrap'}>
                <Flex direction={'column'} style={{display: 'none'}} className={clsx(classes.highlightCard, classes.highlightBlueToIndigo)}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18} />
                        <Text className={classes.highlightCardTitle}>Attempts</Text>
                    </Flex>
                    <Text className={classes.highlightCardValue}>{props.attemptsTotal}</Text>
                </Flex>
                <Flex direction={'column'} className={clsx(classes.highlightCard, classes.highlightRed)}>
                    <Flex className={classes.highlightCardTop}>
                        <IconTargetOff size={18} />
                        <Text className={classes.highlightCardTitle}>Fail</Text>
                    </Flex>
                    <Text className={classes.highlightCardValue}>{props.attemptsFailedPercentage}%</Text>
                </Flex>
                <Flex direction={'column'} className={clsx(classes.highlightCard)} style={{backgroundImage: `linear-gradient(90deg, ${hslToRGBA(averageAttemptsTotalHighlightColor, 0.2)}, ${hslToRGBA(averageAttemptsTotalHighlightColor, 0.3)})`}}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18} style={{stroke: averageAttemptsTotalHighlightColor}} />
                        <Text className={classes.highlightCardTitle}>Avg. Grade</Text>
                    </Flex>
                    <Text className={classes.highlightCardValue} c={averageAttemptsTotalHighlightColor}>
                        {props.averageAttemptsTotal === 0 ? 'N/A' : props.averageAttemptsTotal}
                    </Text>
                </Flex>
                <Flex direction={'column'} className={clsx(classes.highlightCard)} style={{backgroundImage: `linear-gradient(90deg, ${hslToRGBA(averageAttemptsPassedHighlightColor, 0.1)}, ${hslToRGBA(averageAttemptsPassedHighlightColor, 0.12)})`}}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18} style={{stroke: averageAttemptsPassedHighlightColor}} />
                        <Text className={classes.highlightCardTitle}>Avg. Grade (Passed)</Text>
                    </Flex>
                    <Text className={classes.highlightCardValue} c={averageAttemptsPassedHighlightColor}>
                        {props.averageAttemptsPassed === 0 ? 'N/A' : props.averageAttemptsPassed}
                    </Text>
                </Flex>

                <Flex direction={'row'} w={'100%'} justify={'space-between'} align={'center'} maw={420} className={clsx(classes.highlightCard, classes.highlightCardAttempts, classes.highlightBlueToIndigo)}>
                    <Flex className={classes.highlightCardTop}>
                        <IconUsers size={18} />
                        <Text fz={'xs'}>Attempts / Success / Failed</Text>
                    </Flex>
                    <Flex c={'dimmed'} gap={8}>
                        <Text c={'gray.9'} span fw={500}>
                            {props.attemptsTotal}
                        </Text>
                        /
                        <Text c={'green'} span fw={500}>
                            {props.attemptsTotal - props.peopleAttemptsFailed}
                        </Text>
                        /
                        <Text c={'red'} span fw={500}>
                            {props.peopleAttemptsFailed}
                        </Text>
                    </Flex>
                </Flex>

                <Flex direction={'column'} w={'100%'}>
                    <Text mt={24} mb={32} fw="bold" fz={'sm'}>
                        Grades Distribution
                    </Text>
                    <BarChart
                        className={classes.barChart}
                        h={200}
                        w={'calc(100% - 25px)'}
                        data={props.grades}
                        dataKey={'grade'}
                        series={[
                            {
                                name: 'people',
                                color: 'blue',
                            },
                        ]}
                        tooltipProps={{
                            content: ({label, payload}) => (
                                <Paper px="md" py="sm" withBorder shadow="md" radius="md">
                                    <Flex direction={'column'}>
                                        <Text fw={500} mb={5} fz={'sm'} c={'blue'}>
                                            {label}
                                        </Text>
                                        {payload.map((item: any) => {
                                            return (
                                                <Text key={item.name} c={'black'} fz="sm">
                                                    {item.value} {item.name}
                                                </Text>
                                            );
                                        })}
                                    </Flex>
                                </Paper>
                            ),
                        }}
                        referenceLines={[
                            {
                                x: 20,
                                color: 'red.9',
                                label: 'Fail',
                                labelPosition: 'insideTopRight',
                            },
                        ]}
                        barProps={{
                            shape: (props) => {
                                return <rect {...props} fill={barColor(props.payload.grade)} rx={4} ry={4} />;
                            },
                        }}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export {GradesBox};
