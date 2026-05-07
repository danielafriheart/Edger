import { EmailOtpFlow } from '@/features/auth/EmailOtpFlow';
import { parsePrefillEmailFromQuery } from '@/lib/url-email-prefill';

export const metadata = {
  title: 'Sign in · Edger',
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const prefilledEmail = parsePrefillEmailFromQuery(await searchParams);
  return <EmailOtpFlow chrome="login" prefilledEmail={prefilledEmail} />;
}
