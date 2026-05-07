import { EmailOtpFlow } from '@/features/auth/EmailOtpFlow';
import { parsePrefillEmailFromQuery } from '@/lib/url-email-prefill';

export const metadata = {
  title: 'Sign up · Edger',
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function SignupPage({ searchParams }: { searchParams: SP }) {
  const prefilledEmail = parsePrefillEmailFromQuery(await searchParams);
  return <EmailOtpFlow chrome="signup" prefilledEmail={prefilledEmail} />;
}
