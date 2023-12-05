import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';

import { getPath, Paths } from './paths.ts';
import { Activation, Course, Home, PageNotFound, Recovery} from '@/pages';
import { MainLayout } from '@/layouts';
import { SpotlightModal } from '@/components/Modals/SpotlightModal/SpotlightModal.tsx';
import { RecoveryModal, SignInModal, SignUpModal, ModalsHashController } from '@/components/Modals';
import { AddCourseModal } from '@/components/Modals/AddCourseModal/AddCourseModal.tsx';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview/AddUserReview.tsx';
import { EditUserReviewModal } from '@/components/Modals/EditUserReview';


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
                <MainLayout>
                    <PageNotFound />
                </MainLayout>
            ),
            element: (
                <ModalsProvider modals={modals}>
                        <ModalsHashController/>
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
