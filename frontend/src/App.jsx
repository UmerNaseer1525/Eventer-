import { Provider } from "react-redux";
import store from "./store";

import MyEvents from "./Pages/Events/MyEvents";
import EventDetails from "./Components/Event_Detail";
import Attendees from "./Pages/Events/Attendees";
import Analytics from "./Pages/Analytics/Analytics";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import AdminProfile from "./Pages/Users/AdminProfile";
import ManageEvents from "./Pages/Events/ManageEvents";
import AdminEvents from "./Pages/Events/AdminEvents";

import ManageBookings from "./Pages/Bookings/ManageBookings";

import MyProfile from "./Pages/Users/MyProfile";
import UserRequests from "./Pages/Users/UserRequests";
import "./App.css";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import LandingPage from "./Pages/Landing/LandingPage";
import Settings from "./Pages/Setting/Settings";
import Events from "./Pages/Events/Events";
import Users from "./Pages/Users/Users";
import Reports from "./Pages/Reports/Reports";
import Notifications from "./Pages/Notifications/Notifications";
import ProtectRoute from "./Components/ProtectRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <ProtectRoute allowedRoles={["user"]} />,
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
        path: "/my-profile",
        element: (
          <MainLayout>
            <MyProfile />
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
    ],
  },
  {
    element: <ProtectRoute />,
    children: [
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
  {
    element: <ProtectRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin-dashboard",
        element: (
          <MainLayout>
            <AdminDashboard />
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
      },
      {
        path: "/user-requests",
        element: (
          <MainLayout>
            <UserRequests />
          </MainLayout>
        ),
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
        path: "/admin-events",
        element: (
          <MainLayout>
            <AdminEvents />
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
