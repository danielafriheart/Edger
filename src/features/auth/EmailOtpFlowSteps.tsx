'use client';

import { LoginCodeStep } from '../../components/auth/LoginCodeStep';
import { LoginEmailStep } from '../../components/auth/LoginEmailStep';
import { LoginIdentityStep } from '../../components/auth/LoginIdentityStep';
import { LoginProfileStep } from '../../components/auth/LoginProfileStep';
import type { useEmailOtpFlow } from './useEmailOtpFlow';

type Flow = ReturnType<typeof useEmailOtpFlow>;

export function IdentityStep({ flow }: { flow: Flow }) {
  return (
    <LoginIdentityStep
      firstName={flow.firstName}
      onFirstNameChange={flow.setFirstName}
      lastName={flow.lastName}
      onLastNameChange={flow.setLastName}
      email={flow.email}
      onEmailChange={flow.setEmail}
      fetching={flow.fetching}
      formError={flow.formError}
      signInFields={flow.signInFields}
      onSubmit={flow.handleIdentitySubmit}
    />
  );
}

export function EmailStep({ flow }: { flow: Flow }) {
  return (
    <LoginEmailStep
      email={flow.email}
      onEmailChange={flow.setEmail}
      fetching={flow.fetching}
      formError={flow.formError}
      signInFields={flow.signInFields}
      onSubmit={flow.handleEmailSubmit}
    />
  );
}

export function CodeStep({ flow, onCodeChange }: { flow: Flow; onCodeChange?: (v: string) => void }) {
  return (
    <LoginCodeStep
      code={flow.code}
      onCodeChange={onCodeChange ?? flow.setCode}
      fetching={flow.fetching}
      formError={flow.formError}
      signInFields={flow.signInFields}
      onResendCode={flow.resendCode}
      onSubmit={flow.handleCodeSubmit}
      onStartOver={flow.startOver}
    />
  );
}

export function ProfileStep({ flow }: { flow: Flow }) {
  return (
    <LoginProfileStep
      missingFields={flow.profileMissingFields}
      fetching={flow.fetching}
      formError={flow.formError}
      signUpFields={flow.signUpFields}
      legalAccepted={flow.legalAccepted}
      onLegalAccepted={flow.setLegalAccepted}
      otherAccepted={flow.otherAccepted}
      onOtherAccepted={(id, checked) =>
        flow.setOtherAccepted((prev) => ({ ...prev, [id]: checked }))}
      firstName={flow.firstName}
      onFirstName={flow.setFirstName}
      lastName={flow.lastName}
      onLastName={flow.setLastName}
      username={flow.username}
      onUsername={flow.setUsername}
      phoneNumber={flow.phoneNumber}
      onPhoneNumber={flow.setPhoneNumber}
      extraStrings={flow.extraStrings}
      onExtraStringChange={(fieldId, value) =>
        flow.setExtraStrings((prev) => ({ ...prev, [fieldId]: value }))}
      onSubmit={flow.handleProfileSubmit}
      onStartOver={flow.startOver}
    />
  );
}
