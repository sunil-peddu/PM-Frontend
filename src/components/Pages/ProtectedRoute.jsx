import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user?.role)) {
    switch (user?.role) {
      case "super_admin":
        return <Navigate to="/super-admin" replace />;

      case "admin":
        return <Navigate to="/admin" replace />;

      case "manager":
        return <Navigate to="/manager" replace />;

      case "user":
        return <Navigate to="/employee" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;