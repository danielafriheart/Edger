/** Read `email` query for auth handoff between `/login` and `/signup` (no validated search schema). */
export function parsePrefillEmailFromLocationSearch(locationSearch: unknown): string | undefined {
  let rawQuery: string | undefined;
  if (typeof locationSearch === "string") {
    rawQuery = locationSearch.startsWith("?") ? locationSearch.slice(1) : locationSearch;
  } else if (typeof locationSearch === "object" && locationSearch !== null && !Array.isArray(locationSearch)) {
    const bag = locationSearch as Record<string, unknown>;
    if (typeof bag.email === "string") {
      const t = bag.email.trim().toLowerCase();
      return t.length > 0 ? t : undefined;
    }
  }
  if (!rawQuery) return undefined;
  try {
    const v = new URLSearchParams(rawQuery).get("email");
    if (!v) return undefined;
    const t = v.trim().toLowerCase();
    return t.length > 0 ? t : undefined;
  } catch {
    return undefined;
  }
}
