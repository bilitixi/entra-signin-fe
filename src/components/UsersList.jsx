import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function UsersList({ refreshKey }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/users").then(async (res) => {
      if (!res || cancelled) return; // apiFetch may have redirected to /auth/login
      if (!res.ok) {
        setError(`Failed to load users (${res.status})`);
        return;
      }
      setUsers(await res.json());
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (error) return <p role="alert">{error}</p>;
  if (!users) return <p>Loading users…</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.is_active ? "yes" : "no"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
