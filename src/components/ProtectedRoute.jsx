import { Navigate, useLocation } from "react-router-dom";
import { clearAuthSession, isTokenExpired } from "../utils/auth";

/**
 * Renders children only if user has a stored token; otherwise redirects to /login.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    clearAuthSession();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
