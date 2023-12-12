import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { getPath, Paths } from './paths.ts';
import { Activation, Course, Home, PageNotFound, Recovery } from '@/pages';
import { MainLayout } from '@/layouts';
import { SpotlightModal } from '@/components/Modals/SpotlightModal/SpotlightModal.tsx';
import { ModalsHashController, RecoveryModal, SignInModal, SignUpModal } from '@/components/Modals';
import { AddCourseModal } from '@/components/Modals/AddCourseModal/AddCourseModal.tsx';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview/AddUserReview.tsx';
import { EditUserReviewModal } from '@/components/Modals/EditUserReview';
import { ModalsProvider } from '@mantine/modals';

const modals = {
    signIn: SignInModal,
    signUp: SignUpModal,
    addCourse: AddCourseModal,
    addUserReview: AddUserReviewModal,
    editUserReview: EditUserReviewModal,
    spotlight: SpotlightModal,
    recovery: RecoveryModal,
};

const RoutesApp = () => {
    const routes = [
        {
            path: '/',
            errorElement: (
                <ModalsProvider modals={modals}>
                    <ModalsHashController />
                    <PageNotFound />
                </ModalsProvider>
            ),
            element: (
                <MainLayout>
                    <ModalsProvider modals={modals}>
                        <ModalsHashController />
                        <Outlet />
                    </ModalsProvider>
                </MainLayout>
            ),
            children: [
                {
                    path: '/',
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Home />
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.activate),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Activation />
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.recovery),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Recovery />
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.courseDetail),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Course />
                        </Suspense>
                    ),
                },
            ],
        },
    ];

    return (
        <Suspense>
            <RouterProvider router={createBrowserRouter(routes)} />
        </Suspense>
    );
};

export { RoutesApp };
