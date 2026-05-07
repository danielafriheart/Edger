import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Edger',
  description: 'Get sized in. Position-size with confidence.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/login'
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/signup'

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider signInUrl={signInUrl} signUpUrl={signUpUrl}>
      <html lang="en">
        <body className="min-h-svh">{children}</body>
      </html>
    </ClerkProvider>
  );
}
