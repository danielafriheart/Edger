import { createFileRoute } from '@tanstack/react-router';
import RiskAnalyzer from '../features/RiskAnalyzer';
import { RequireSignedIn } from '../features/auth/AuthSessionGate';

export const Route = createFileRoute('/app')({
  component: AppShell,
});

function AppShell() {
  return (
    <RequireSignedIn>
      <RiskAnalyzer />
    </RequireSignedIn>
  );
}
