import { createFileRoute } from '@tanstack/react-router';
import RiskAnalyzer from '../features/RiskAnalyzer';

export const Route = createFileRoute('/app')({
  component: RiskAnalyzer,
});
