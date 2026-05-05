function baseRelPath(segment: string) {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return `/${segment}`;
  return base.endsWith("/") ? `${base}${segment}` : `${base}/${segment}`;
}

/** Full navigation to `/app` — survives Clerk/UI-router edge cases where client-side replace does nothing. */
export function redirectToApp() {
  const pathname = baseRelPath("app");
  window.location.replace(new URL(pathname, window.location.origin).href);
}

/** Full navigation to `/login`; same rationale as {@link redirectToApp}. */
export function redirectToLogin() {
  const pathname = baseRelPath("login");
  window.location.replace(new URL(pathname, window.location.origin).href);
}
