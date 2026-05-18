/**
 * Read a single `email` query param without trusting any specific shape.
 * Used to hand off `?email=...` between `/login` and `/signup` so users don't
 * retype on switch.
 */
export function parsePrefillEmailFromQuery(
  search: string | URLSearchParams | Record<string, unknown> | null | undefined,
): string | undefined {
  if (search == null) return undefined;

  let raw: string | null = null;

  if (typeof search === 'string') {
    const q = search.startsWith('?') ? search.slice(1) : search;
    raw = new URLSearchParams(q).get('email');
  } else if (search instanceof URLSearchParams) {
    raw = search.get('email');
  } else if (typeof search === 'object' && !Array.isArray(search)) {
    const bag = search as Record<string, unknown>;
    if (typeof bag.email === 'string') raw = bag.email;
  }

  if (!raw) return undefined;
  const trimmed = raw.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : undefined;
}
