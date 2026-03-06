import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token"),
  );
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [location]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default ProtectRoute;
