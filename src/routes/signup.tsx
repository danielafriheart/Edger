import { createFileRoute } from '@tanstack/react-router';
import Signup from '../features/Signup';

export const Route = createFileRoute('/signup')({
  component: Signup,
});
