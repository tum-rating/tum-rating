import {Flex, Paper, Text, ThemeIcon} from "@mantine/core";
import {ReactNode} from "react";
import {useNavigate} from "react-router-dom";

import classes from "./AdminStatsBox.module.css"

interface AdminStatsBoxProps {
    value: number;
    title: string;
    icon: ReactNode;
    description: string;
    link: string;
}

const AdminStatsBox = ({value, title, icon, description, link}: AdminStatsBoxProps) => {
    const navigate = useNavigate();
    return (
        <Paper tabIndex={0} withBorder p="md" radius="md" key={title} className={classes.box} onClick={() => {
            navigate(link)
        }}>
            <Flex justify="space-between">
                <div>
                    <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                        {title}
                    </Text>
                    <Text fw={700} fz="xl">
                        {value || "-"}
                    </Text>
                </div>
                <ThemeIcon
                    color="gray"
                    variant="light"
                    size={38}
                    radius="md"
                >
                    {icon}
                </ThemeIcon>
            </Flex>
            <Text c="dimmed" fz="sm" mt="md">
                {description}
            </Text>
        </Paper>
    )
}

export {AdminStatsBox}