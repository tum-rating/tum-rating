import {PieChart} from '@mantine/charts';
import {Box, Flex, Paper, Text} from "@mantine/core";
import clsx from "clsx";
import {useMemo} from 'react';

import {User} from '@/admin/types.ts';
import {useAllUsers} from "@/admin/useAllUsers.ts";
import classes from "@/components/AdminSummary/AdminStatsBox.module.css";


const userStatuses = [
    {
        status: 'banned',
        color: 'red.5',
        label: 'Banned users',
        check: (user: User) => user.isBanned && user.role === 0
    },
    {
        status: 'bannedAdmin',
        color: 'violet.4',
        label: 'Banned admins',
        check: (user: User) => user.isBanned && user.role === 1
    },
    {
        status: 'admin',
        color: 'yellow.5',
        label: 'Admin',
        check: (user: User) => user.role === 1
    },
    {
        status: 'user',
        color: 'blue.3',
        label: 'User',
        check: (user: User) => user.role === 0
    }
]

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props) => {
    const {cx, cy, midAngle, innerRadius, outerRadius, percent, index} = props
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text fontSize="12px" fontWeight={800} x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const AdminUsersSummaryChart = () => {
    const {data: user} = useAllUsers();

    const usersArrangedByStatus = useMemo(() => {
        return userStatuses.map(({status, check, color}) => {
            const value = user.filter(check).length;
            if (!value) return null;
            return {
                name: status,
                value,
                color
            }
        }).filter(Boolean);
    }, [user]);

    return (
        <Paper
            tabIndex={0}
            withBorder
            radius="md"
            p="md"
            h={200}
            className={clsx(classes.box, classes.chartBox)}
        >
            <Flex justify="center" direction="column" h="100%">
                <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                    Users - status
                </Text>
                <Flex gap="lg" h="100%">
                    <PieChart withLabelsLine size={120} w={120} strokeWidth={2} data={usersArrangedByStatus}
                              labelsPosition="inside" labelsType="percent" withLabels
                              pieProps={{
                                  dataKey: 'value',
                                  label: renderCustomizedLabel
                              }}
                    />
                    <Flex direction="column" gap="4" justify="center" align="flex-start" w="40%" style={{
                        flexGrow: 1
                    }}>
                        {usersArrangedByStatus.map(({name, value, color}) => (
                            <Flex align="center" key={name} w="100%" gap={4}>
                                <Box bg={color} style={{width: 15, height: 15}}/>
                                <Flex justify="space-between" align="center" w="100%">
                                    <Text size="xs" fw="500">{name}</Text>
                                    <Text size="xs" fw="500">{value}</Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            </Flex>

        </Paper>
    )
}

export {AdminUsersSummaryChart};