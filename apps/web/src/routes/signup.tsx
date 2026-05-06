import { createFileRoute } from "@tanstack/react-router";
import Signup from "../features/Signup";
import { RedirectIfSignedIn } from "../features/auth/AuthSessionGate";

export const Route = createFileRoute("/signup")({
  component: () => (
    <RedirectIfSignedIn>
      <Signup />
    </RedirectIfSignedIn>
  ),
});
