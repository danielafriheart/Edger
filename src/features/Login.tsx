import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

// =============================================================================
// /login → /signup redirect
// -----------------------------------------------------------------------------
// Edger uses a single /signup page that smart-detects new vs returning users.
// /login exists only as a redirect alias so old links and muscle-memory still
// land on the right page.
// =============================================================================

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/signup", replace: true });
  }, [navigate]);

  return (
    <div className="landing-root h-[100svh] flex items-center justify-center text-zinc-500 font-mono text-sm">
      Redirecting…
    </div>
  );
}
