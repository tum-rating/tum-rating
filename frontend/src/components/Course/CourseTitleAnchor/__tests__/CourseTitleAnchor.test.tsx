import {screen} from '@testing-library/react';

import {CourseTitleAnchor} from '@/components/Course/CourseTitleAnchor/CourseTitleAnchor';
import {TUM_CAMPUS_COURSE_URL_FN} from '@/constants';
import {render} from "tests/unit/utils/render";

describe('CourseTitleAnchor', () => {
    const defaultProps = {
        courseId: '123',
        children: 'Course Title',
    };

    it('should render the anchor with the correct href', () => {
        const {children, ...anchorProps} = defaultProps;
        render(<CourseTitleAnchor {...anchorProps} >{children}</CourseTitleAnchor>);
        const anchor = screen.getByText('Course Title');
        expect(anchor).toBeInTheDocument();
        expect(anchor).toHaveAttribute('href', TUM_CAMPUS_COURSE_URL_FN('123'));
    });

    it('should open the link in a new tab', () => {
        const {children, ...anchorProps} = defaultProps;
        render(<CourseTitleAnchor {...anchorProps}>{children}</CourseTitleAnchor>);
        const anchor = screen.getByText('Course Title');
        expect(anchor).toHaveAttribute('target', '_blank');
    });

    it('should render children correctly', () => {
        const {children, ...anchorProps} = defaultProps;
        render(<CourseTitleAnchor {...anchorProps}>Custom Title</CourseTitleAnchor>);
        const anchor = screen.getByText('Custom Title');
        expect(anchor).toBeInTheDocument();
    });

    it('should handle empty children', () => {
        const {children, ...anchorProps} = defaultProps;
        render(<CourseTitleAnchor {...anchorProps}>{null}</CourseTitleAnchor>);
        const anchor = screen.getByRole('link');
        expect(anchor).toBeEmptyDOMElement();
    });
});
