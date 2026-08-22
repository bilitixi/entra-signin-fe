import { Route, Routes } from "react-router-dom";
import { RequireRole } from "./auth/RequireRole";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

// FRONTEND_POST_LOGIN_URL / FRONTEND_POST_LOGOUT_URL (backend env vars)
// point at "/" — landing here re-runs AuthProvider's GET /auth/me check on
// the fresh page load, so no dedicated /post-login route is needed
// (ENTRA_SIGNIN_SETUP.md B5).
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/*"
        element={
          <RequireRole roles={["icib_admin"]}>
            <AdminDashboard />
          </RequireRole>
        }
      />
    </Routes>
  );
}
