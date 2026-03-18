import { Outlet } from "react-router-dom";

// Auth checking is handled by the authLoader in App.jsx.
// If the loader passes, the user is authenticated — just render children.
function ProtectRoute() {
  return <Outlet />;
}

export default ProtectRoute;
