import { ReactNode } from 'react';
import { Anchor, Box, Text } from '@mantine/core';
import classes from './Breadcrumbs.module.css';
import { useNavigate } from 'react-router-dom';

const BreadcrumbsComponent = ({ courseName }: { courseName: ReactNode }) => {
    const navigate = useNavigate();
    return (
        <Box className={classes.courseBreadcrumbsContainer}>
            <Anchor
                onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                }}
                fz="sm"
                c="dimmed"
                underline="hover"
                href="#"
            >
                Home
            </Anchor>
            <Text mx={7}>/</Text>
            <Anchor fz="sm" fw={500} c="black" underline="hover" href="#" truncate>
                {courseName}
            </Anchor>
        </Box>
    );
};

export { BreadcrumbsComponent as Breadcrumbs };
