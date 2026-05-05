/** Split display name into Clerk first/last (best-effort; required fields validated on submit). */
export function splitFullNameForClerk(full: string): { firstName: string; lastName: string } {
  const t = full.trim().replace(/\s+/g, " ");
  if (!t) {
    return { firstName: "", lastName: "" };
  }
  const idx = t.indexOf(" ");
  if (idx === -1) {
    return { firstName: t, lastName: t };
  }
  return {
    firstName: t.slice(0, idx),
    lastName: t.slice(idx + 1).trim() || t.slice(0, idx),
  };
}

/** Clerk-facing username slug from user's full display name (a-z 0-9 underscore). */
export function usernameFromFullName(full: string): string {
  let s = full
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  if (!s) {
    s = "trader";
  }
  return s.slice(0, 30);
}
