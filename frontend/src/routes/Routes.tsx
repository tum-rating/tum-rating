import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { getPath, Paths } from "./paths.ts";
import { Home } from "../pages";
import { Suspense } from "react";
import {MainLayout} from "../layouts";

const RoutesApp = () => {
  const routes = [
    {
      path: "/",
      element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
      ),
      children: [
        {
          path: "/",
          element: (
              <Suspense fallback={"Loading..."}>
               <Home/>
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
