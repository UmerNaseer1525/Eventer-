import { Provider } from "react-redux";
import store from "./store";

import MyEvents from "./Pages/Events/MyEvents";
import EventDetails from "./Pages/Events/EventDetails";
import Attendees from "./Pages/Events/Attendees";
import Analytics from "./Pages/Analytics/Analytics";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import AdminProfile from "./Pages/Users/AdminProfile";
import ManageEvents from "./Pages/Events/ManageEvents";
import ManageCategories from "./Pages/Categories/ManageCategories";
import ManageBookings from "./Pages/Bookings/ManageBookings";
import ManageUsers from "./Pages/Users/ManageUsers";
import MyProfile from "./Pages/Users/MyProfile";
import "./App.css";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Settings from "./Pages/Setting/Settings";
import Events from "./Pages/Events/Events";
import Users from "./Pages/Users/Users";
import Categories from "./Pages/Categories/Categories";
import Bookings from "./Pages/Bookings/Bookings";
import Payments from "./Pages/Payments/Payments";
import Reports from "./Pages/Reports/Reports";
import Notifications from "./Pages/Notifications/Notifications";
import ProtectRoute from "./Components/ProtectRoute";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { getAllUsersLoader } from "./Services/userService";

function authLoader() {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/");
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <ProtectRoute />,
    loader: authLoader,
    children: [
      {
        path: "/dashboard",
        element: (
          <MainLayout>
            <Dashboard />
          </MainLayout>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        ),
      },
      {
        path: "/events",
        element: (
          <MainLayout>
            <Events />
          </MainLayout>
        ),
      },
      {
        path: "/my-events",
        element: (
          <MainLayout>
            <MyEvents />
          </MainLayout>
        ),
      },
      {
        path: "/event-details/:id",
        element: (
          <MainLayout>
            <EventDetails />
          </MainLayout>
        ),
      },
      {
        path: "/attendees/:eventId",
        element: (
          <MainLayout>
            <Attendees />
          </MainLayout>
        ),
      },
      {
        path: "/analytics",
        element: (
          <MainLayout>
            <Analytics />
          </MainLayout>
        ),
      },
      {
        path: "/users",
        element: (
          <MainLayout>
            <Users />
          </MainLayout>
        ),
        loader: getAllUsersLoader,
      },
      {
        path: "/admin-profile",
        element: (
          <MainLayout>
            <AdminProfile />
          </MainLayout>
        ),
      },
      {
        path: "/manage-events",
        element: (
          <MainLayout>
            <ManageEvents />
          </MainLayout>
        ),
      },
      {
        path: "/manage-categories",
        element: (
          <MainLayout>
            <ManageCategories />
          </MainLayout>
        ),
      },
      {
        path: "/manage-bookings",
        element: (
          <MainLayout>
            <ManageBookings />
          </MainLayout>
        ),
      },
      {
        path: "/manage-users",
        element: (
          <MainLayout>
            <ManageUsers />
          </MainLayout>
        ),
      },
      {
        path: "/my-profile",
        element: (
          <MainLayout>
            <MyProfile />
          </MainLayout>
        ),
      },
      {
        path: "/categories",
        element: (
          <MainLayout>
            <Categories />
          </MainLayout>
        ),
      },
      {
        path: "/bookings",
        element: (
          <MainLayout>
            <Bookings />
          </MainLayout>
        ),
      },
      {
        path: "/payments",
        element: (
          <MainLayout>
            <Payments />
          </MainLayout>
        ),
      },
      {
        path: "/reports",
        element: (
          <MainLayout>
            <Reports />
          </MainLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <MainLayout>
            <Settings />
          </MainLayout>
        ),
      },
      {
        path: "/notifications",
        element: (
          <MainLayout>
            <Notifications />
          </MainLayout>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
