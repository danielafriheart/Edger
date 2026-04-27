import { createFileRoute } from '@tanstack/react-router';
import Waitlist from '../features/Waitlist';

export const Route = createFileRoute('/waitlist')({
  component: Waitlist,
});
