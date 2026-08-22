import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "../components/Spinner";

// UX only — the backend independently enforces role/ownership on every
// endpoint (AUTHENTICATION.md §9). This just avoids showing a screen to
// someone who'd get a 403 from the API anyway.
export function RequireRole({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
