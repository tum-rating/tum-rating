import {Flex, Paper, Text, ThemeIcon} from '@mantine/core';
import {ReactNode} from 'react';
import {useNavigate} from 'react-router-dom';

import classes from './AdminStatsBox.module.css';

interface AdminStatsBoxProps {
    options: {
        value: number;
        diffInPercent: number;
        diffValue: number;
    }
    title: string;
    icon: ReactNode;
    description: string;
    link: string;
}

const AdminStatsBox = ({options, title, icon, description, link}: AdminStatsBoxProps) => {
    const navigate = useNavigate();
    const {value, diffInPercent, diffValue} = options;
    return (
        <Paper
            tabIndex={0}
            withBorder
            p="md"
            radius="md"
            key={title}
            className={classes.box}
            onClick={() => {
                navigate(link);
            }}
        >
            <Flex justify="space-between">
                <div>
                    <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                        {title}
                    </Text>
                    <Text fw={700} fz="xl">
                        {value || '-'}
                        {
                            diffValue ? (
                                <Text
                                    component="span"
                                    c={'green'}
                                    ml="xs"
                                    size="sm"
                                    fw={700}
                                >
                                    +{diffValue}
                                    <Text
                                        ml="3"
                                        display="inline"
                                        c={'green'}
                                        fw={700}
                                        size="xs"
                                    >
                                        ({diffInPercent ? `+${diffInPercent}%` : ""} in last 12h)
                                    </Text>
                                </Text>
                            ) : null
                        }
                    </Text>
                </div>
                <ThemeIcon color="gray" variant="light" size={38} radius="md">
                    {icon}
                </ThemeIcon>
            </Flex>
            <Text c="dimmed" fz="sm" mt="md">
                {description}
            </Text>
        </Paper>
    );
};

export {AdminStatsBox};
