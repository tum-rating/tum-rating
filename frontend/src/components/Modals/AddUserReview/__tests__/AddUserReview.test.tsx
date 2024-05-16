import {UseMutationResult, UseQueryResult} from "@tanstack/react-query";
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {User, useUser} from "@/auth/useUser.tsx";
import {DetailCourse} from "@/courses/types.ts";
import {useAddUserReview, UserAddReviewInput} from "@/courses/useAddUserReview.tsx";
import {useDetailCourse} from "@/courses/useCourse.tsx";
import { Paths } from '@/routes/paths.ts';
import {user, courseDetails} from "tests/mocks/handlers.ts";
import { openModal } from 'tests/utils/modals.tsx';

vi.mock('@/auth/useUser.tsx', () => ({
    useUser: vi.fn(),
}));

vi.mock('@/courses/useAddUserReview.tsx', () => ({
    useAddUserReview: vi.fn(),
}));

vi.mock('@/courses/useCourse.tsx', () => ({
    useDetailCourse: vi.fn(),
}));


describe('Modal: AddUserReview', () => {
    beforeEach(() => {
        console.log(courseDetails)
        openModal(Paths.addUserReview);
    });

    it('renders AddUserReview modal without crashing', async () => {
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        (useUser as jest.MockedFunction<typeof useUser>).mockReturnValue({
            data: user,
            isSuccess: true,
            isLoading: false
        } as UseQueryResult<User, Error>);
        console.log(courseDetails)
        (useDetailCourse as jest.MockedFunction<typeof useDetailCourse>).mockReturnValue({
            data: courseDetails
        } as UseQueryResult<DetailCourse, Error>);

        (useAddUserReview as jest.MockedFunction<typeof useAddUserReview>).mockReturnValue({
            mutate: vi.fn(),
            isSuccess: false,
            isLoading: false,
        } as unknown as UseMutationResult<void, Error, UserAddReviewInput, unknown>);

    });

    // it('displays login panel if there is no user', async () => {
    //     // (useUser as jest.MockedFunction<typeof useUser>).mockReturnValue({
    //     //     data: null,
    //     // } as UseQueryResult<User, Error>);
    //
    // })




});
