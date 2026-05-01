import { createFileRoute } from '@tanstack/react-router';
import Legal from '../features/Legal';

export const Route = createFileRoute('/legal')({
  component: Legal,
});
