import {ModalsProvider} from '@mantine/modals';
import {lazy, Suspense} from 'react';
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';

import {getPath, Paths} from './paths.ts';

import {RouteLoader} from '@/components/Loaders';
import {ModalsHashController, RecoveryModal, SignInModal, SignUpModal} from '@/components/Modals';
import {AddCourseModal} from '@/components/Modals/AddCourseModal/AddCourseModal.tsx';
import {AddUserReviewModal} from '@/components/Modals/AddUserReview/AddUserReview.tsx';
import {EditUserReviewModal} from '@/components/Modals/EditUserReview';
import {UserSettingsModal} from '@/components/Modals/UserSettingsModal';
import {AdminLayout, MainLayout} from '@/layouts';
import {
    About,
    Activation,
    Course,
    ErrorBoundary,
    Feedback,
    Home,
    OAuthRedirect,
    PrivacyPolicy,
    Recovery,
    TermsOfService
} from '@/pages';

const Admin = lazy(async () => {
    let {Admin} = await import('@/pages');
    return {default: Admin};
});

//--- TABLES
const AdminCoursesTable = lazy(async () => {
    let {AdminCoursesTable} = await import('@/components/AdminTable');
    return {default: AdminCoursesTable};
});

const AdminCoursesProposalsTable = lazy(async () => {
    let {AdminCoursesProposalsTable} = await import('@/components/AdminTable');
    return {default: AdminCoursesProposalsTable};
});

const AdminUsersTable = lazy(async () => {
    let {AdminUsersTable} = await import('@/components/AdminTable');
    return {default: AdminUsersTable};
});

const AdminReviewsTable = lazy(async () => {
    let {AdminReviewsTable} = await import('@/components/AdminTable');
    return {default: AdminReviewsTable};
});

//--- ADMIN DETAILS

const AdminUserDetails = lazy(async () => {
    let {AdminUserDetails} = await import('@/pages/Admin/AdminUserDetails');
    return {default: AdminUserDetails};
});

const AdminCoursesProposalsDetails = lazy(async () => {
    let {AdminCoursesProposalsDetails} = await import('@/pages/Admin/AdminCoursesProposalsDetails');
    return {default: AdminCoursesProposalsDetails};
});

const AdminCoursesDetails = lazy(async () => {
    let {AdminCoursesDetails} = await import('@/pages/Admin/AdminCoursesDetails');
    return {default: AdminCoursesDetails};
});

const SuspenseLayout = () => (
    <Suspense fallback={<RouteLoader/>}>
        <Outlet/>
    </Suspense>
);

const modals = {
    signIn: SignInModal,
    signUp: SignUpModal,
    addCourse: AddCourseModal,
    addUserReview: AddUserReviewModal,
    editUserReview: EditUserReviewModal,
    recovery: RecoveryModal,
    userSettings: UserSettingsModal,
};

const routes = [
    {
        element: <SuspenseLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                path: '/',
                element: (
                    <MainLayout>
                        <ModalsProvider modals={modals}>
                            <ModalsHashController/>
                            <Outlet/>
                        </ModalsProvider>
                    </MainLayout>
                ),
                children: [
                    {
                        path: '/',
                        element: <Home/>,
                    },
                    {
                        path: getPath(Paths.activate),
                        element: <Activation/>,
                    },
                    {
                        path: getPath(Paths.recovery),
                        element: <Recovery/>,
                    },

                    {
                        path: getPath(Paths.courseDetail),
                        element: <Course/>,
                    },
                    {
                        path: getPath(Paths.about),
                        element: <About/>,
                    },
                    {
                        path: getPath(Paths.feedback),
                        element: <Feedback/>,
                    },
                    {
                        path: getPath(Paths.privacyPolicy),
                        element: <PrivacyPolicy/>,
                    },
                    {
                        path: getPath(Paths.termsOfService),
                        element: <TermsOfService/>,
                    },
                ],
            },
            {
                path: getPath(Paths.oAuthRedirect),
                element: <OAuthRedirect/>,
            },
            {
                path: getPath(Paths.admin),
                element: (
                    <AdminLayout>
                        <ModalsProvider modals={modals}>
                            <ModalsHashController/>
                            <Outlet/>
                        </ModalsProvider>
                    </AdminLayout>
                ),
                children: [
                    {
                        path: getPath(Paths.admin),
                        element: <Admin/>,
                    },
                    {
                        path: getPath(Paths.adminAllCourses),
                        element: <AdminCoursesTable/>,
                    },
                    {
                        path: getPath(Paths.adminCoursesProposals),
                        element: <AdminCoursesProposalsTable/>,
                    },
                    {
                        path: getPath(Paths.adminUsers),
                        element: <AdminUsersTable/>,
                    },
                    {
                        path: getPath(Paths.adminReviews),
                        element: <AdminReviewsTable/>
                    },
                    {
                        path: getPath(Paths.adminUserDetails),
                        element: <AdminUserDetails/>,
                    },
                    {
                        path: getPath(Paths.adminCoursesProposalsDetails),
                        element: <AdminCoursesProposalsDetails/>,
                    },
                    {
                        path: getPath(Paths.adminCoursesDetails),
                        element: <AdminCoursesDetails/>,
                    },
                ],
            },
        ],
    },
];

const RoutesApp = () => {
    return (
        <Suspense>
            <RouterProvider router={createBrowserRouter(routes)}/>
        </Suspense>
    );
};

export {RoutesApp, routes, modals};
