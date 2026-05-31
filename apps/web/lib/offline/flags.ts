/** localStorage key set once the user has finished their first session. */
export const HAS_LOGGED_KEY = "stead:hasLoggedSession";

export function hasLoggedSession(): boolean {
  try {
    return localStorage.getItem(HAS_LOGGED_KEY) === "1";
  } catch {
    return false;
  }
}
