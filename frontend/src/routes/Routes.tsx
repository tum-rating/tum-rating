import { ModalsProvider } from '@mantine/modals';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { getPath, Paths } from './paths.ts';

import { RouteLoader } from '@/components/Loaders';
import { ModalsHashController, RecoveryModal, SignInModal, SignUpModal } from '@/components/Modals';
import { AddCourseModal } from '@/components/Modals/AddCourseModal/AddCourseModal.tsx';
import { AddUserReviewModal } from '@/components/Modals/AddUserReview/AddUserReview.tsx';
import { EditUserReviewModal } from '@/components/Modals/EditUserReview';
import { AdminLayout, MainLayout } from '@/layouts';
import { Activation, Course, ErrorBoundary, Home, Recovery } from '@/pages';

const Admin = lazy(async () => {
    let { Admin } = await import('@/pages');
    return { default: Admin };
});

//--- TABLES
const AdminCoursesTable = lazy(async () => {
    let { AdminCoursesTable } = await import('@/components/AdminTable');
    return { default: AdminCoursesTable };
});

const AdminCoursesProposalsTable = lazy(async () => {
    let { AdminCoursesProposalsTable } = await import('@/components/AdminTable');
    return { default: AdminCoursesProposalsTable };
});

const AdminUsersTable = lazy(async () => {
    let { AdminUsersTable } = await import('@/components/AdminTable');
    return { default: AdminUsersTable };
});

//--- ADMIN DETAILS

const AdminUserDetails = lazy(async () => {
    let { AdminUserDetails } = await import('@/pages/Admin/AdminUserDetails');
    return { default: AdminUserDetails };
});

const AdminCoursesProposalsDetails = lazy(async () => {
    let { AdminCoursesProposalsDetails } = await import('@/pages/Admin/AdminCoursesProposalsDetails');
    return { default: AdminCoursesProposalsDetails };
});

const AdminCoursesDetails = lazy(async () => {
    let { AdminCoursesDetails } = await import('@/pages/Admin/AdminCoursesDetails');
    return { default: AdminCoursesDetails };
});

const SuspenseLayout = () => (
    <Suspense fallback={<RouteLoader />}>
        <Outlet />
    </Suspense>
);

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
        element: <SuspenseLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: '/',
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
                        element: <Home />,
                    },
                    {
                        path: getPath(Paths.activate),
                        element: <Activation />,
                    },
                    {
                        path: getPath(Paths.recovery),
                        element: <Recovery />,
                    },
                    {
                        path: getPath(Paths.courseDetail),
                        element: <Course />,
                    },
                ],
            },
            {
                path: getPath(Paths.admin),
                element: (
                    <AdminLayout>
                        <ModalsProvider modals={modals}>
                            <ModalsHashController />
                            <Outlet />
                        </ModalsProvider>
                    </AdminLayout>
                ),
                children: [
                    {
                        path: getPath(Paths.admin),
                        element: <Admin />,
                    },
                    {
                        path: getPath(Paths.adminAllCourses),
                        element: <AdminCoursesTable />,
                    },
                    {
                        path: getPath(Paths.adminCoursesProposals),
                        element: <AdminCoursesProposalsTable />,
                    },
                    {
                        path: getPath(Paths.adminUsers),
                        element: <AdminUsersTable />,
                    },
                    {
                        path: getPath(Paths.adminUserDetails),
                        element: <AdminUserDetails />,
                    },
                    {
                        path: getPath(Paths.adminCoursesProposalsDetails),
                        element: <AdminCoursesProposalsDetails />,
                    },
                    {
                        path: getPath(Paths.adminCoursesDetails),
                        element: <AdminCoursesDetails />,
                    },
                ],
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
