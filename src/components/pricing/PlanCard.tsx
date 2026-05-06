import Link from 'next/link';

export type PlanCta = {
  label: string;
  href: string;
  beforeNavigate?: () => void;
};

export function PlanCard({
  tier,
  price,
  cadence,
  description,
  features,
  cta,
  footnote,
  highlighted = false,
}: {
  tier: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: PlanCta;
  footnote?: string;
  highlighted?: boolean;
}) {
  if (highlighted) {
    return (
      <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
        <div className="bg-white rounded-[20px] p-6 md:p-7 h-full flex flex-col">
          <PlanHeader tier={tier} price={price} cadence={cadence} description={description} highlighted />
          <PlanFeatures features={features} />
          <Link
            href={cta.href}
            onClick={() => cta.beforeNavigate?.()}
            className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.15)]"
          >
            {cta.label}
            <span aria-hidden>→</span>
          </Link>
          {footnote && (
            <p className="font-mono text-[10px] tracking-tight text-zinc-500 text-center mt-3">{footnote}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/70 p-6 md:p-7 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex flex-col">
      <PlanHeader tier={tier} price={price} cadence={cadence} description={description} />
      <PlanFeatures features={features} />
      <Link
        href={cta.href}
        onClick={() => cta.beforeNavigate?.()}
        className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
      >
        {cta.label}
        <span aria-hidden>→</span>
      </Link>
      {footnote && (
        <p className="font-mono text-[10px] tracking-tight text-zinc-500 text-center mt-3">{footnote}</p>
      )}
    </div>
  );
}

function PlanHeader({
  tier,
  price,
  cadence,
  description,
  highlighted,
}: {
  tier: string;
  price: string;
  cadence: string;
  description: string;
  highlighted?: boolean;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
          {tier}
        </span>
        {highlighted && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] uppercase tracking-[0.22em] font-semibold text-emerald-700 font-mono">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            Most popular
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-4xl md:text-5xl font-medium tabular-nums tracking-[-0.03em] text-zinc-950">
          {price}
        </span>
        <span className="font-mono text-[12px] text-zinc-500 tabular-nums">{cadence}</span>
      </div>
      <p className="text-zinc-600 text-[14px] leading-relaxed">{description}</p>
    </div>
  );
}

function PlanFeatures({ features }: { features: string[] }) {
  return (
    <ul className="space-y-2.5 mb-7">
      {features.map((f) => (
        <li key={f} className="flex gap-2.5 text-[13px] text-zinc-700 leading-relaxed">
          <svg
            className="mt-0.5 w-4 h-4 text-emerald-600 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12.5l5 5L20 6.5" />
          </svg>
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}
