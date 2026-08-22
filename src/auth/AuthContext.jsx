import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((res) => (res && res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// apiFetch's 401 handler already redirects to /auth/login if the session is
// missing/expired, so `user` staying null after loading resolves means
// "redirect is already in flight" — no separate error UI needed for that case.
export const useAuth = () => useContext(AuthContext);
