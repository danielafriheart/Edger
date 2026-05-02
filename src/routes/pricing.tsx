import { createFileRoute } from '@tanstack/react-router';
import Pricing from '../features/Pricing';

export const Route = createFileRoute('/pricing')({
  component: Pricing,
});
