import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RequireAuth = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const from = location.pathname + location.search;

  if (!user) return <Navigate to="/login" replace state={{ from }} />;
  if (!user.is_verify) return <Navigate to="/verify-phone" replace state={{ from }} />;
  return <Outlet />;
};

export default RequireAuth;
