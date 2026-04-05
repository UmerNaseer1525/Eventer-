import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredUser, isBlockedUser, normalizeRole } from "../utils/auth";

function ProtectRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = normalizeRole(user?.role);
  const blocked = role === "user" && isBlockedUser(user);
  if (blocked && location.pathname !== "/settings") {
    return <Navigate to="/settings" replace />;
  }

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return <Outlet />;
  }

  const normalizedAllowedRoles = allowedRoles.map((item) =>
    normalizeRole(item),
  );
  if (!normalizedAllowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectRoute;
