import { ClerkLoaded, ClerkLoading, useAuth } from "@clerk/react";
import { type ReactNode, useLayoutEffect } from "react";
import { redirectToApp, redirectToLogin } from "./authRedirect";

function LoginBootstrapSpinner() {
  return (
    <div className="landing-root h-svh flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-emerald-500 edger-dot-pulse" />
      <span className="sr-only">Loading authentication…</span>
    </div>
  );
}

function SignedInHardRedirect() {
  useLayoutEffect(() => {
    redirectToApp();
  }, []);

  return <LoginBootstrapSpinner />;
}

function SignedOutHardRedirect() {
  useLayoutEffect(() => {
    redirectToLogin();
  }, []);

  return <LoginBootstrapSpinner />;
}

/**
 * Uses the same criterion as guarded routes (/app): `useAuth().isSignedIn` only.
 * Broader signals (session id shards, cached user refs) caused false positives and
 * a /login ⇄ /app loop when `isSignedIn` briefly disagreed post-full-reload.
 */
function AuthenticatedInner({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <SignedInHardRedirect />;
  }

  return children;
}

/**
 * Clerk bootstrap + redirect signed-in users to `/app`. Children should mount `useSignIn` / `useSignUp` only here.
 */
export function AuthSessionGate({ children }: { children: ReactNode }) {
  return (
    <>
      <ClerkLoading>
        <LoginBootstrapSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        <AuthenticatedInner>{children}</AuthenticatedInner>
      </ClerkLoaded>
    </>
  );
}

function RequireSignedInInner({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <SignedOutHardRedirect />;
  }

  return children;
}

/**
 * For protected UI (e.g. `/app`). Same session criterion as login redirect: {@link useAuth}.`isSignedIn` only.
 */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  return (
    <>
      <ClerkLoading>
        <LoginBootstrapSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        <RequireSignedInInner>{children}</RequireSignedInInner>
      </ClerkLoaded>
    </>
  );
}
