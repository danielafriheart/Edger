'use client';

import { useState } from 'react';
import { Field, SectionCard } from './ProfilePrimitives';

export function AccountSection({
  displayName,
  email,
  onNameSave,
}: {
  displayName: string;
  email: string;
  onNameSave: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState(displayName);
  const [prevDisplayName, setPrevDisplayName] = useState(displayName);
  const [saving, setSaving] = useState(false);

  if (displayName !== prevDisplayName) {
    setPrevDisplayName(displayName);
    setName(displayName);
  }

  const dirty = name.trim().length > 0 && name.trim() !== displayName.trim();

  return (
    <div className="space-y-5">
      <SectionCard
        kicker="Identity"
        title="Account info"
        sub="Your name and email. Email comes from your sign-in identity."
      >
        <Field label="Full name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
          />
        </Field>

        <Field label="Email">
          <div className="relative">
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-3 text-sm font-mono text-zinc-600 cursor-not-allowed pr-20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] uppercase tracking-[0.22em] font-semibold text-emerald-700 font-mono">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Verified
            </span>
          </div>
        </Field>

        {dirty && (
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              void (async () => {
                setSaving(true);
                try {
                  await onNameSave(name.trim());
                } catch (e) {
                  window.alert(e instanceof Error ? e.message : 'Could not update name.');
                } finally {
                  setSaving(false);
                }
              })();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors self-start shadow-[0_2px_4px_rgba(0,0,0,0.08)] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        )}
      </SectionCard>

      <SectionCard
        kicker="Danger zone"
        title="Delete account"
        sub="Permanently remove your account and any usage data."
        tone="danger"
      >
        <button
          type="button"
          onClick={() => alert('Coming soon — this will be wired to the backend.')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-50 transition-colors self-start"
        >
          Delete my account
        </button>
      </SectionCard>
    </div>
  );
}
