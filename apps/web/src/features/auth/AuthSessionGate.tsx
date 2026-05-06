import { useAuth } from "@clerk/react";
import { type ReactNode, useLayoutEffect } from "react";
import { redirectToApp } from "./authRedirect";
import { redirectToLogin } from "./authRedirect";

// ─────────────────────────────────────────────────────────────────────────────
// Auth gates — the SINGLE place that decides:
//   • signed-in user visits a protected page → show content
//   • signed-out user visits a protected page → hard redirect to /login
//   • signed-in user visits a guest page → hard redirect to /app
//   • signed-out user visits a guest page → show content
// ─────────────────────────────────────────────────────────────────────────────

function AuthSpinner() {
  return (
    <div className="landing-root h-svh flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-emerald-500 edger-dot-pulse" />
      <span className="sr-only">Loading authentication…</span>
    </div>
  );
}

// ─── RequireSignedIn ────────────────────────────────────────────────────────
// Wrap protected pages (e.g. /app, /profile).
// If not signed in → redirect to /login.
// ────────────────────────────────────────────────────────────────────────────

export function RequireSignedIn({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  useLayoutEffect(() => {
    if (isLoaded && !isSignedIn) redirectToLogin();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <AuthSpinner />;
  if (!isSignedIn) return <AuthSpinner />; // will redirect in the effect

  return children;
}

// ─── RedirectIfSignedIn ─────────────────────────────────────────────────────
// Wrap guest-only pages (e.g. /login, /signup).
// If already signed in → redirect to /app.
// ────────────────────────────────────────────────────────────────────────────

export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  useLayoutEffect(() => {
    if (isLoaded && isSignedIn) redirectToApp();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null; // don't flash the login form
  if (isSignedIn) return null; // will redirect in the effect

  return children;
}
