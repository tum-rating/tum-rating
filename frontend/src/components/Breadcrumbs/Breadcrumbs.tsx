import { Anchor, Box, Text, Tooltip } from '@mantine/core';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './Breadcrumbs.module.css';

import { Skeleton } from '@/components/Skeleton';


interface BreadcrumbsProps {
    courseName: ReactNode;
    isLoading: boolean;
}

const BreadcrumbsComponent = ({ courseName, isLoading }: BreadcrumbsProps) => {
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
            <Tooltip openDelay={500} label={courseName} multiline={true} transitionProps={{ transition: 'fade', duration: 100 }}>
                <Skeleton
                    radius="lg"
                    loading={isLoading}
                    h={22}
                    w={150}
                    component={
                        <Anchor fz="sm" fw={500} underline="hover" href="#" truncate>
                            {courseName}
                        </Anchor>
                    }
                />
            </Tooltip>
        </Box>
    );
};

export { BreadcrumbsComponent as Breadcrumbs };
