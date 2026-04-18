// Autenticação local simples — sem Supabase
const ADMIN_EMAIL    = "emerson@sistema.com";
const ADMIN_PASSWORD = "041980";
const SESSION_KEY    = "master_admin_session";

export function adminLogin(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
