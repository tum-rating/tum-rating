import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AddUserReviewModal } from '@/components/Modals/AddUserReview';
import { render } from 'tests/utils/render';
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {generateJwtToken} from "tests/mocks/dataGenerators.ts";


describe('Modal: AddUserReview', () => {
    let queryClient: QueryClient;
    beforeEach(async () => {
        queryClient = new QueryClient();
    });
    describe('when user is logged in', () => {
        beforeEach(async () => {
            userLocalStorage.saveUser(generateJwtToken());
        })
        it('should render AddUserReview modal without crashing', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddUserReviewModal
                        id={null}
                        context={null}
                        innerProps={{
                            courseId: null,
                        }}
                    />
                </QueryClientProvider>,
            );
            expect(screen.getByTestId('trigger')).toBeInTheDocument();
            // await userEvent.click(screen.getByTestId('trigger'));
            // await openModal();
        });

    });
    describe('when user is not logged in', () => {
        it('should display panel with login/register buttons and message', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <AddUserReviewModal
                        id={null}
                        context={null}
                        innerProps={{
                            courseId: null,
                        }}
                    />
                </QueryClientProvider>,
            );
            await waitFor(() => {
                expect(screen.getByTestId('message')).toHaveTextContent('Only registered users can add reviews.');
                expect(screen.getByTestId('sign-in-btn')).toBeInTheDocument();
                expect(screen.getByTestId('sign-up-btn')).toBeInTheDocument();
            });
        });
    });
    // it('should render AddUserReview modal without crashing', async () => {
    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <AddUserReviewModal
    //                 id={null}
    //                 context={null}
    //                 innerProps={{
    //                     courseId: null,
    //                 }}
    //             />
    //         </QueryClientProvider>,
    //     );
    //     expect(screen.getByTestId('trigger')).toBeInTheDocument();
    //     // await userEvent.click(screen.getByTestId('trigger'));
    //     // await openModal();
    // });
    // describe('when user is logged in', () => {
    //     beforeEach(async () => {
    //         queryClient = new QueryClient();
    //         userLocalStorage.saveUser(generateJwtToken());
    //     });
    // });
    // describe('when user is not logged in', () => {
    //     beforeEach(async () => {
    //         queryClient = new QueryClient();
    //     });
    // });

    // it('renders AddUserReview modal without crashing', async () => {
    //
    //     await openModal(Paths.addUserReview);
    // });

    // it('displays login panel if there is no user', async () => {
    //     // (useUser as jest.MockedFunction<typeof useUser>).mockReturnValue({
    //     //     data: null,
    //     // } as UseQueryResult<User, Error>);
    //
    // })
});
