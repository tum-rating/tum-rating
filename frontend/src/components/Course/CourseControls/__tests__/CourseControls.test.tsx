import {screen} from '@testing-library/react';

import {User} from '@/auth/useUser.tsx';
import {CourseControls} from '@/components/Course/CourseControls/CourseControls';
import {Course} from '@/courses/types.ts';
import {render} from 'tests/unit/utils/render';

describe('CourseControls', () => {

    const defaultProps = {
        data: {name: 'Test Course'} as Course,
        isLoading: false,
        userReview: null,
        user: {id: 1, username: 'Test User', email: 'testuser@test.test'} as User,
    };

    it('should render the back button', () => {
        render(<CourseControls {...defaultProps} />);
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('should render the breadcrumbs with course name', () => {
        render(<CourseControls {...defaultProps} />);
        expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    it('should render "Sign In to add review" button when user is not logged in', () => {
        render(<CourseControls {...defaultProps} user={null} />);
        expect(screen.getByText('Sign In to add review')).toBeInTheDocument();
    });

    it('should render "Edit your review" button when user has a review', () => {
        render(<CourseControls {...defaultProps} userReview={{id: '1'}} />);
        expect(screen.getByText('Edit your review')).toBeInTheDocument();
    });

    it('should render "Add review" button when user is logged in and has no review', () => {
        render(<CourseControls {...defaultProps} />);
        expect(screen.getByText('Add review')).toBeInTheDocument();
    });
});
