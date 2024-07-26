import {Anchor, AnchorProps} from '@mantine/core';
import {ReactNode} from 'react';

import {TUM_CAMPUS_COURSE_URL_FN} from '@/constants';

interface CourseTitleAnchorProps extends AnchorProps {
    courseId: string;
    children: ReactNode;
}

const CourseTitleAnchor = (props: CourseTitleAnchorProps) => {
    const {children, courseId, ...anchorProps} = props;
    return (
        <Anchor href={TUM_CAMPUS_COURSE_URL_FN(courseId)} {...anchorProps} target="_blank">
            {children}
        </Anchor>
    );
};

export {CourseTitleAnchor};
