import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (_error) {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role =
    String(user?.role || "").toLowerCase() === "admin" ? "admin" : "user";
  const homePath = role === "admin" ? "/admin-dashboard" : "/dashboard";
  const blocked =
    role === "user" && String(user?.status || "").toLowerCase() === "blocked";
  if (blocked && location.pathname !== "/settings") {
    return <Navigate to="/settings" replace />;
  }

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return <Outlet />;
  }

  const normalizedAllowedRoles = allowedRoles.map((item) =>
    String(item || "").toLowerCase() === "admin" ? "admin" : "user",
  );
  if (!normalizedAllowedRoles.includes(role)) {
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
}

export default ProtectRoute;
