import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false, superAdminOnly = false }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (superAdminOnly && user.role !== "superadmin") {
    return <Navigate to="/dashboard" />;
  }

  if (adminOnly && user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}