import { useState } from "react";
import CreateUserForm from "../components/CreateUserForm";
import UsersList from "../components/UsersList";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <h1>Admin dashboard</h1>
      <CreateUserForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <UsersList refreshKey={refreshKey} />
    </div>
  );
}
