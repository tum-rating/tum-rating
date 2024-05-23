import { ModalsProvider } from '@mantine/modals';
import { Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { getPath, Paths } from './paths.ts';

import { RouteLoader } from '@/components/Loaders';
import { ModalsHashController, RecoveryModal, SignInModal, SignUpModal } from '@/components/Modals';
import { AddCourseModal } from '@/components/Modals/AddCourseModal/AddCourseModal.tsx';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview/AddUserReview.tsx';
import { EditUserReviewModal } from '@/components/Modals/EditUserReview';
import { AdminLayout, MainLayout } from '@/layouts';
import { Activation, Course, ErrorBoundary, Home, Recovery } from '@/pages';

const modals = {
    signIn: SignInModal,
    signUp: SignUpModal,
    addCourse: AddCourseModal,
    addUserReview: AddUserReviewModal,
    editUserReview: EditUserReviewModal,
    recovery: RecoveryModal,
};

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
                    <Suspense fallback={RouteLoader()}>
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
        element: (
            <AdminLayout>
                <ModalsProvider modals={modals}>
                    <Outlet />
                </ModalsProvider>
            </AdminLayout>
        ),
        children: [
            {
                path: getPath(Paths.admin),
                fallbackElement: <RouteLoader />,
                lazy: async () => {
                    let { Admin } = await import('@/pages/Admin/Admin.tsx');
                    return { Component: Admin };
                },
            },
            {
                path: getPath(Paths.adminCourses),
                fallbackElement: <RouteLoader />,
                lazy: async () => {
                    let { AdminCoursesTable } = await import('@/components/AdminTable/Courses/AdminCoursesTable.tsx');
                    return { Component: AdminCoursesTable };
                },
            },
            {
                path: getPath(Paths.adminCoursesProposals),
                fallbackElement: <RouteLoader />,
                lazy: async () => {
                    let { AdminCoursesProposalsTable } = await import('@/components/AdminTable/CoursesProposals/AdminCoursesProposalsTable.tsx');
                    return { Component: AdminCoursesProposalsTable };
                },
            },
            {
                path: getPath(Paths.adminUsers),
                fallbackElement: <RouteLoader />,
                lazy: async () => {
                    let { AdminUsersTable } = await import('@/components/AdminTable/Users/AdminUsersTable.tsx');
                    return { Component: AdminUsersTable };
                },
            },
        ],
    },
];

const RoutesApp = () => {
    return (
        <Suspense>
            <RouterProvider router={createBrowserRouter(routes)} />
        </Suspense>
    );
};

export { RoutesApp, routes, modals };
