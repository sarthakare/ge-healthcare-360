import { Navigate, useLocation } from "react-router-dom";

/**
 * Renders children only if user has a token and role is 'admin'; otherwise redirects.
 */
function AdminRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (_) {}

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
