import {ActionIcon, Box, Button, Flex, rem} from '@mantine/core';
import {useWindowScroll} from '@mantine/hooks';
import {IconArrowLeft, IconCirclePlus, IconEditCircle} from '@tabler/icons-react';
import {isMobile} from 'react-device-detect';
import {useNavigate} from 'react-router-dom';

import classes from './CourseControls.module.css';

import {User} from '@/auth/useUser.tsx';
import {Breadcrumbs} from '@/components/Breadcrumbs';
import {Course} from '@/courses/types.ts';
import {getPath, Paths} from '@/routes/paths.ts';

interface CourseControlsProps {
    data: Course | null;
    isLoading: boolean;
    userReview: any;
    user: User | null;
}

const CourseControls = ({data, user, userReview, isLoading}: CourseControlsProps) => {
    const [scroll] = useWindowScroll();
    const scrollFlag = scroll.y >= 5;
    const navigate = useNavigate();

    return (
        <Flex className={classes.courseControls} data-active={scrollFlag}>
            <Button className={classes.courseControlsBackButton} variant="outline" mr="sm" size="xs" leftSection={<IconArrowLeft size="1.1rem" />} onClick={() => navigate('/')}>
                Back
            </Button>
            <ActionIcon className={classes.courseControlsBackActionButton} mr="sm" size="sm" onClick={() => navigate('/')}>
                <IconArrowLeft size="1.1rem" />
            </ActionIcon>
            <Box className={classes.courseControlsBreadcrumbs}>
                <Breadcrumbs isLoading={isLoading} courseName={data?.name} />
            </Box>
            <Box className={classes.courseControlsBtns}>
                {!user ? (
                    <Button loading={isLoading} size={isMobile ? 'md' : 'sm'} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}} onClick={() => navigate(getPath(Paths.signIn))} leftSection={<IconCirclePlus style={{width: rem(16), height: rem(16)}} />}>
                        Sign In to add review
                    </Button>
                ) : userReview ? (
                    <Button data-testid="edit-review" loading={isLoading} size={isMobile ? 'md' : 'sm'} variant="gradient" gradient={{from: 'teal', to: 'lime', deg: 170}} onClick={() => navigate(getPath(Paths.editUserReview))} leftSection={<IconEditCircle style={{width: rem(16), height: rem(16)}} />}>
                        Edit your review
                    </Button>
                ) : (
                    <Button data-testid="add-review" loading={isLoading} size={isMobile ? 'md' : 'sm'} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}} onClick={() => navigate(getPath(Paths.addUserReview))} leftSection={<IconCirclePlus style={{width: rem(16), height: rem(16)}} />}>
                        Add review
                    </Button>
                )}
            </Box>
            <Box className={classes.courseControlsOverlay} />
        </Flex>
    );
};

export {CourseControls};
