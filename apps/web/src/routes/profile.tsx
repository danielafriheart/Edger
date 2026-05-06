import { createFileRoute } from "@tanstack/react-router";
import Profile from "../features/Profile";
import { RequireSignedIn } from "../features/auth/AuthSessionGate";

export const Route = createFileRoute("/profile")({
  component: () => (
    <RequireSignedIn>
      <Profile />
    </RequireSignedIn>
  ),
});
