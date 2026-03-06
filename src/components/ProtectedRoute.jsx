import { Navigate, useLocation } from "react-router-dom";

/**
 * Renders children only if user has a stored token; otherwise redirects to /login.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
