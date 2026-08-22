// The SPA never talks to Entra directly and never stores a token — it only
// calls this app's own /api/v1/auth/* endpoints and relies on the session
// cookie. See AUTHENTICATION.md §4-§5, §9.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // sends the session cookie on every call
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Don't auto-redirect back into Entra if we just landed here *because*
    // a sign-in attempt was rejected (?auth_error=...) — that would bounce
    // the user straight into another failed attempt instead of letting
    // them see why it failed. See src/pages/Home.jsx.
    const justFailed = new URLSearchParams(window.location.search).has("auth_error");
    if (!justFailed) {
      window.location.href = `${BASE_URL}/auth/login`;
      return; // navigation is happening; nothing more to do
    }
  }
  return res;
}

export { BASE_URL };
