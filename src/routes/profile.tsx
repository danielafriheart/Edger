import { createFileRoute } from '@tanstack/react-router';
import Profile from '../features/Profile';

export const Route = createFileRoute('/profile')({
  component: Profile,
});
