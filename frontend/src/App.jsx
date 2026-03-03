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
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes without sidebar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Login />} />

        {/* Protected routes with sidebar - all pages automatically get sidebar on left */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/events"
          element={
            <MainLayout>
              <Events />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout>
              <Users />
            </MainLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <MainLayout>
              <Categories />
            </MainLayout>
          }
        />
        <Route
          path="/bookings"
          element={
            <MainLayout>
              <Bookings />
            </MainLayout>
          }
        />
        <Route
          path="/payments"
          element={
            <MainLayout>
              <Payments />
            </MainLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <MainLayout>
              <Notifications />
            </MainLayout>
          }
        />

        {/* Add more routes here - they will automatically get the sidebar layout */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
