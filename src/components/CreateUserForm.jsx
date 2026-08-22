import { useState } from "react";
import { apiFetch } from "../api/client";

const ROLES = ["member", "staff", "icib_admin"];

// Provisions a local User row by email, and (when the backend has
// ENTRA_CIAM_DOMAIN configured) also creates the matching Entra identity
// with a one-time temp password — so the person can click "Sign in"
// straight away instead of an admin creating them manually in the portal
// first. Posts to POST /api/v1/users, admin-only.
export default function CreateUserForm({ onCreated }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("member");
  const [status, setStatus] = useState(null); // null | "saving" | { error } | { user }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");

    const res = await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify({
        email,
        role,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    if (!res) return; // apiFetch redirected to /auth/login

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus({ error: body.detail || `Request failed (${res.status})` });
      return;
    }

    setStatus({ user: body });
    setEmail("");
    setFirstName("");
    setLastName("");
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
        First name
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last name
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
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

      {status?.user && (
        <div>
          <p>
            Created {status.user.email} ({status.user.role}).
          </p>
          {status.user.temp_password && (
            <p>
              <strong>Temp password (shown once — send it to them now):</strong>{" "}
              <code>{status.user.temp_password}</code>
              <br />
              They'll be required to set their own password the moment they
              click "Sign in".
            </p>
          )}
        </div>
      )}
    </form>
  );
}
