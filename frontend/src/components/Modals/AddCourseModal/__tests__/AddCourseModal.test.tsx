import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Link } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { getPath, Paths } from '@/routes/paths.ts';
import { render } from 'tests/utils/render.tsx';

describe('Modal: AddCourseModal', () => {
    beforeEach(() => {
        render(<Link data-testid="add-course-trigger" to={getPath(Paths.addCourse)} />);
        expect(screen.getByTestId('add-course-trigger')).toBeInTheDocument();
        userEvent.click(screen.getByTestId('add-course-trigger'));
        waitFor(() => {
            expect(screen.getByTestId('add-course-modal-content')).toBeInTheDocument();
        });
    });

    it('renders AddCourseModal modal without crashing', () => {
        waitFor(() => {
            expect(screen.getByTestId('add-course-modal-content')).toBeInTheDocument();
        });
    });

    it('displays error message when form is submitted with invalid URL', async () => {
        let textarea = null;
        await waitFor(() => {
            textarea = screen.getByTestId('textarea');
        });
        expect(textarea).toBeInTheDocument();
        await userEvent.type(textarea, 'invalid-url');
        await userEvent.click(screen.getByTestId('submit-button'));
        await waitFor(() => {
            expect(textarea).toHaveAttribute('aria-invalid', 'true');
        });
    });

    it('close AddCourseModal modal if form is submitted with valid URL', async () => {
        let textarea = null;
        await waitFor(() => {
            textarea = screen.getByTestId('textarea');
        });
        expect(textarea).toBeInTheDocument();
        await userEvent.type(textarea, 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950600157?$scrollTo=toc_overview');
        await userEvent.click(screen.getByTestId('submit-button'));
        await new Promise((r) => setTimeout(r, 500));
        await waitFor(() => {
            expect(screen.queryByTestId('add-course-modal-content')).not.toBeInTheDocument();
        });
    });
});
