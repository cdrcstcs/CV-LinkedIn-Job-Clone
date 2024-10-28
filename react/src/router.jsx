import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ApplicationPublicView from "./views/ApplicationPublicView";
import Applications from "./views/Applications";
import ApplicationView from "./views/ApplicationView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Navigate to="/" />
      },
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/applications",
        element: <Applications />,
      },
      {
        path: "/applications/create",
        element: <ApplicationView />,
      },
      {
        path: "/applications/:id",
        element: <ApplicationView />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/application/public/:slug",
    element: <ApplicationPublicView />,
  },
]);

export default router;
