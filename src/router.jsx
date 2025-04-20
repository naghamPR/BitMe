import { createBrowserRouter } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { Layout } from "./components";
import {
  Home,
  Login,
  Register,
  Error,
  Resturants,
  ResturantsDetails,
} from "./pages";

export const createRoutes = (user) =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        // <ProtectedRoute user={user}>
        <Layout />
        // </ProtectedRoute>
        // <Home />
      ),
      children: [
        { path: "/", element: <Home />, errorElement: <Error /> },
        {
          path: "/Resturants",
          element: <Resturants />,
          errorElement: <Error />,
        },
        {
          path: "/Resturants/:id",
          element: <ResturantsDetails />,
          errorElement: <Error />,
        },
      ],
    },

    {
      path: "/login",
      element: (
        <UnauthenticatedRoute user={user}>
          <Login />
        </UnauthenticatedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/register",
      element: (
        <UnauthenticatedRoute user={user}>
          <Register />
        </UnauthenticatedRoute>
      ),
      errorElement: <Error />,
    },
  ]);

const ProtectedRoute = ({ user, children }) => {
  console.log(user);
  return user ? children : <Navigate to="/login" />;
};

const UnauthenticatedRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};
