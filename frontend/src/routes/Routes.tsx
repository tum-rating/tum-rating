import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { getPath, Paths } from "./paths.ts";
import {Course, Home} from "../pages";
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
          {
              path: getPath(Paths[":id"]),
              element: (
                    <Suspense fallback={"Loading..."}>
                        <Course/>
                    </Suspense>

              )
          }
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
