import { ModalsProvider } from '@mantine/modals';
import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { getPath, Paths } from './paths.ts';

import { AdminCoursesProposalsTable, AdminCoursesTable, AdminUsersTable } from '@/components/AdminTable';
import { ModalsHashController, RecoveryModal, SignInModal, SignUpModal } from '@/components/Modals';
import { AddCourseModal } from '@/components/Modals/AddCourseModal/AddCourseModal.tsx';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview/AddUserReview.tsx';
import { EditUserReviewModal } from '@/components/Modals/EditUserReview';
import { AdminLayout, MainLayout } from '@/layouts';
import { Activation, Admin, Course, Home, ErrorBoundary, Recovery } from '@/pages';

const modals = {
    signIn: SignInModal,
    signUp: SignUpModal,
    addCourse: AddCourseModal,
    addUserReview: AddUserReviewModal,
    editUserReview: EditUserReviewModal,
    recovery: RecoveryModal,
};

const RoutesApp = () => {
    const routes = [
        {
            path: '/',
            errorElement: <ErrorBoundary />,
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
        {
            path: getPath(Paths.admin),
            errorElement: <ErrorBoundary />,
            element: <AdminLayout>
                <ModalsProvider modals={modals}>
                    <ModalsHashController />
                    <Outlet/>
                </ModalsProvider>
            </AdminLayout>,
            children: [
                {
                    path: getPath(Paths.admin),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Admin />
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.adminCourses),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <AdminCoursesTable />
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.adminCoursesProposals),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <AdminCoursesProposalsTable />
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.adminUsers),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <AdminUsersTable />
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
