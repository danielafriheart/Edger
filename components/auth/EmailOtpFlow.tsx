'use client';

import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import { AlreadySignedInCard } from '@/components/auth/AlreadySignedInCard';
import { CodeStep, EmailStep, IdentityStep, ProfileStep } from '@/components/auth/EmailOtpFlowSteps';
import { LoginAuthCard } from '@/components/auth/LoginAuthCard';
import { LoginFooterLinks } from '@/components/auth/LoginFooterLinks';
import { LoginPageLayout } from '@/components/auth/LoginPageLayout';
import { SignupPageChrome } from '@/components/auth/SignupPageChrome';
import { useEmailOtpFlow, type AuthEmailOtpChrome } from '@/hooks/useEmailOtpFlow';

export function EmailOtpFlow({
  chrome,
  prefilledEmail,
}: {
  chrome: AuthEmailOtpChrome;
  /** From `?email=` when switching between `/login` and `/signup`. */
  prefilledEmail?: string;
}) {
  const { isLoaded, userId } = useAuth();
  const flow = useEmailOtpFlow({ chrome, prefilledEmail });

  const headlineAndSub = useMemo(() => {
    if (flow.step === 'code') {
      return {
        title: 'Check your email',
        subtitle: `Enter the verification code we sent to ${flow.email.trim()}`,
      };
    }
    if (flow.step === 'profile') {
      return { title: 'Almost there', subtitle: 'A few details to finish your account.' };
    }
    return {
      title: 'Welcome back.',
      subtitle: "Sign in with your email — we'll send a one-time code.",
    };
  }, [flow.step, flow.email]);

  const codeOnChange =
    chrome === 'signup' ? (v: string) => flow.setCode(v.replace(/\D/g, '').slice(0, 6)) : flow.setCode;

  const footer = (
    <LoginFooterLinks
      alternateTo={chrome === 'login' ? '/signup' : '/login'}
      alternateLabel={
        chrome === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'
      }
      alternateSearch={{ email: flow.email.trim().toLowerCase() || undefined }}
    />
  );

  if (!isLoaded) {
    return (
      <LoginPageLayout>
        <p className="text-center text-zinc-500 text-sm py-16">Loading…</p>
      </LoginPageLayout>
    );
  }

  if (userId) {
    return (
      <LoginPageLayout>
        <AlreadySignedInCard context={chrome} />
      </LoginPageLayout>
    );
  }

  if (chrome === 'signup') return <SignupChrome flow={flow} footer={footer} codeOnChange={codeOnChange} />;
  return <LoginChrome flow={flow} footer={footer} codeOnChange={codeOnChange} headline={headlineAndSub} />;
}

function SignupChrome({
  flow,
  footer,
  codeOnChange,
}: {
  flow: ReturnType<typeof useEmailOtpFlow>;
  footer: React.ReactNode;
  codeOnChange: (v: string) => void;
}) {
  return (
    <SignupPageChrome footer={footer}>
      {flow.step === 'identity' ? (
        <>
          <SignupIdentityHeader />
          <IdentityStep flow={flow} />
          <SignupReassuranceFooter />
        </>
      ) : null}
      {flow.step === 'code' ? (
        <>
          <SignupCodeHeader email={flow.email.trim()} />
          <CodeStep flow={flow} onCodeChange={codeOnChange} />
        </>
      ) : null}
      {flow.step === 'profile' ? (
        <>
          <SignupProfileHeader />
          <ProfileStep flow={flow} />
        </>
      ) : null}
    </SignupPageChrome>
  );
}

function LoginChrome({
  flow,
  footer,
  codeOnChange,
  headline,
}: {
  flow: ReturnType<typeof useEmailOtpFlow>;
  footer: React.ReactNode;
  codeOnChange: (v: string) => void;
  headline: { title: string; subtitle: string };
}) {
  return (
    <LoginPageLayout>
      <LoginAuthCard
        title={headline.title}
        subtitle={headline.subtitle}
        footerNote="Clerk auth • Supabase uses your signed-in JWT"
      >
        {flow.step === 'email' ? <EmailStep flow={flow} /> : null}
        {flow.step === 'code' ? <CodeStep flow={flow} onCodeChange={codeOnChange} /> : null}
        {flow.step === 'profile' ? <ProfileStep flow={flow} /> : null}
      </LoginAuthCard>
      {footer}
    </LoginPageLayout>
  );
}

function SignupIdentityHeader() {
  return (
    <div className="text-center mb-7">
      <h1 className="text-[28px] md:text-[32px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
        Get sized in.
      </h1>
      <p className="text-zinc-600 text-[14px] md:text-[15px] leading-relaxed max-w-xs mx-auto">
        First name, last name, and email — then we send a one-time code to your inbox. No password to remember.
      </p>
    </div>
  );
}

function SignupReassuranceFooter() {
  return (
    <div className="flex items-center justify-center gap-2 mt-7 pt-6 border-t border-zinc-100 font-mono text-[11px] tracking-tight text-zinc-500 leading-relaxed">
      <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse shrink-0" />
      Clerk will sign you in or create your account
    </div>
  );
}

function SignupCodeHeader({ email }: { email: string }) {
  return (
    <div className="text-center mb-7">
      <h1 className="text-[26px] md:text-[30px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
        Check your inbox.
      </h1>
      <p className="text-zinc-600 text-[14px] leading-relaxed max-w-sm mx-auto">
        We sent a verification code to <span className="font-mono text-zinc-900">{email}</span>.
      </p>
    </div>
  );
}

function SignupProfileHeader() {
  return (
    <div className="text-center mb-7">
      <h1 className="text-[24px] md:text-[28px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
        Almost there
      </h1>
      <p className="text-zinc-600 text-[14px] leading-relaxed max-w-sm mx-auto">
        Finish what Clerk requires to activate your account.
      </p>
    </div>
  );
}
