import { createFileRoute } from "@tanstack/react-router";
import Login from "../features/Login";
import { RedirectIfSignedIn } from "../features/auth/AuthSessionGate";

export const Route = createFileRoute("/login")({
  component: () => (
    <RedirectIfSignedIn>
      <Login />
    </RedirectIfSignedIn>
  ),
});
