import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Paths } from '@/routes/paths.ts';
import { openModal } from 'tests/utils/modals.tsx';

describe('Modal: AddCourseModal', () => {
    beforeEach(() => {
        openModal(Paths.addCourse);
    });

    it('renders AddCourseModal modal without crashing', async () => {
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
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
            expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
        });
    });
});
