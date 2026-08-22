import { BASE_URL } from "../api/client";

// Plain links, not fetch calls — both endpoints redirect the browser (to
// Entra, then back), which fetch() can't follow the way a full page
// navigation can.
export function LoginButton() {
  return <a href={`${BASE_URL}/auth/login`}>Sign in</a>;
}

export function LogoutButton() {
  return <a href={`${BASE_URL}/auth/logout`}>Sign out</a>;
}
