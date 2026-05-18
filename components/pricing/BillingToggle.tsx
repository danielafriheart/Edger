export type Billing = 'monthly' | 'annual';

export function BillingToggleGroup({
  value,
  onChange,
}: {
  value: Billing;
  onChange: (next: Billing) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-zinc-100/80 border border-zinc-200 rounded-full">
      <BillingToggle label="Monthly" active={value === 'monthly'} onClick={() => onChange('monthly')} />
      <BillingToggle
        label="Annual"
        active={value === 'annual'}
        onClick={() => onChange('annual')}
        badge="Save 17%"
      />
    </div>
  );
}

function BillingToggle({
  label,
  active,
  onClick,
  badge,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
      }`}
    >
      {label}
      {badge && (
        <span
          className={`text-[10px] uppercase tracking-[0.18em] font-mono px-1.5 py-0.5 rounded-full ${
            active ? 'bg-emerald-400/30 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
