import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LoginButton, LogoutButton } from "../components/AuthButtons";
import Spinner from "../components/Spinner";

// Mirrors the auth_error codes /auth/callback redirects with — see
// entra-signin-be AUTHENTICATION.md §9b.
const AUTH_ERROR_MESSAGES = {
  not_provisioned:
    "This email hasn't been invited yet. Ask an admin to add you before signing up.",
  deactivated: "This account has been deactivated. Contact an admin if that's unexpected.",
  identity_mismatch:
    "This sign-in doesn't match the identity on file for this email. Contact an admin.",
  invalid_state: "Your sign-in session expired or was invalid — please try again.",
  login_failed: "Sign-in with Microsoft failed — please try again.",
};

export default function Home() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const authError = searchParams.get("auth_error");

  if (authError) {
    return (
      <div>
        <h1>Sign-in failed</h1>
        <p role="alert">
          {AUTH_ERROR_MESSAGES[authError] || "Something went wrong signing you in."}
        </p>
        <LoginButton />
      </div>
    );
  }

  if (loading) return <Spinner />;

  if (!user) {
    // apiFetch already kicked off a redirect to /auth/login on the 401
    // from /auth/me; this is just the brief moment before navigation lands.
    return <LoginButton />;
  }

  return (
    <div>
      <h1>
        Signed in as {user.first_name || user.email} ({user.role})
      </h1>
      {user.role === "icib_admin" && <Link to="/admin">Admin dashboard</Link>}
      <LogoutButton />
    </div>
  );
}
