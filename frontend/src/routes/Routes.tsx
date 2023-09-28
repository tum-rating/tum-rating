import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';

import { getPath, Paths } from './paths';
import { Activation, Course, Home, PageNotFound } from '@/pages';
import { MainLayout } from '@/layouts';
import { SpotlightModal } from '@/components/Modals/SpotlightModal';
import { SignInModal, SignUpModal } from '@/components/Modals';
import { AddCourseModal } from '@/components/Modals/AddCourseModal';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview';

const modals = {
    signIn: SignInModal,
    signUp: SignUpModal,
    addCourse: AddCourseModal,
    addUserReview: AddUserReviewModal,
    spotlight: SpotlightModal,
};
const RoutesApp = () => {
    const routes = [
        {
            path: '/',
            errorElement: (
                <MainLayout>
                    <PageNotFound />
                </MainLayout>
            ),
            element: (
                <ModalsProvider modals={modals}>
                    <MainLayout>
                        <Outlet />
                    </MainLayout>
                </ModalsProvider>
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
