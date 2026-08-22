import { useState } from "react";
import { apiFetch } from "../api/client";

const ROLES = ["member", "staff", "icib_admin"];

// Provisions a local User row by email so that person can then sign in via
// Entra — sign-in itself never creates an account (AUTHENTICATION.md §2,
// ENTRA_SIGNIN_SETUP.md §0). Posts to POST /api/v1/users, admin-only.
export default function CreateUserForm({ onCreated }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [status, setStatus] = useState(null); // null | "saving" | { error } | { user }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");

    const res = await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });

    if (!res) return; // apiFetch redirected to /auth/login

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus({ error: body.detail || `Request failed (${res.status})` });
      return;
    }

    setStatus({ user: body });
    setEmail("");
    onCreated?.(body);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Provision a user</h2>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="person@yourdomain.com"
        />
      </label>
      <label>
        Role
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Creating…" : "Create"}
      </button>

      {status?.error && <p role="alert">{status.error}</p>}
      {status?.user && <p>Created {status.user.email} ({status.user.role}).</p>}
    </form>
  );
}
