import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LoginButton, LogoutButton } from "../components/AuthButtons";
import Spinner from "../components/Spinner";

export default function Home() {
  const { user, loading } = useAuth();

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
