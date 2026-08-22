# entra-signin-fe

React SPA for Entra ID sign-in. Never talks to Entra directly, never stores
a token — it only calls the backend's `/api/v1/auth/*` endpoints and relies
on the `HttpOnly` session cookie set by Django. See `entra-signin-be`'s
`AUTHENTICATION.md` for the full design rationale, and
`ENTRA_SIGNIN_SETUP.md` for the ordered setup checklist this app follows
(Part B).

## Quickstart

```bash
npm install
cp .env.example .env   # only needed if not using the dev proxy below
npm run dev
```

Run the backend (`entra-signin-be`) on `:8000` at the same time — the dev
server proxies `/api/v1/*` to it (see `vite.config.js`), so cookies stay
same-site during local dev without any CORS setup.

## Structure

| Path | Purpose |
|---|---|
| `src/api/client.js` | `apiFetch` — adds `credentials: "include"`, redirects to `/auth/login` on 401 |
| `src/auth/AuthContext.jsx` | `AuthProvider`/`useAuth` — runs `GET /auth/me` once on mount |
| `src/auth/RequireRole.jsx` | route guard for role-gated pages (UX only, backend still enforces) |
| `src/components/AuthButtons.jsx` | plain `<a>` sign-in/out links (not `fetch` — these are full-page redirects) |
