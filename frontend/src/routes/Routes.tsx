import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import {getPath, Paths} from './paths';
import {Activation, Course, Home, PageNotFound} from '../pages';
import {Suspense} from 'react';
import {MainLayout} from '../layouts';
import {ModalsProvider} from '@mantine/modals';
import {SignInModal, SignUpModal} from '../components/Modals';

const modals = {
    signIn: SignInModal,
    signUp: SignUpModal,
};
declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof modals;
    }
}

const RoutesApp = () => {
    console.log(123);
    const routes = [
        {
            path: '/',
            errorElement: (
                <MainLayout>
                    <PageNotFound/>
                </MainLayout>
            ),
            element: (
                <ModalsProvider modals={modals}>
                    <MainLayout>
                        <Outlet/>
                    </MainLayout>
                </ModalsProvider>
            ),
            children: [
                {
                    path: '/',
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Home/>
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths[':id']),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Course/>
                        </Suspense>
                    ),
                },
                {
                    path: getPath(Paths.activate),
                    element: (
                        <Suspense fallback={'Loading...'}>
                            <Activation/>
                        </Suspense>
                    ),
                },
            ],
        },
    ];

    return (
        <Suspense>
            <RouterProvider router={createBrowserRouter(routes)}/>
        </Suspense>
    );
};

export {RoutesApp};
