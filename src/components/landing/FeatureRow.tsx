import { ShieldIcon, SparkIcon, SpreadsheetIcon } from './LandingIcons';

const FEATURES = [
  {
    icon: <SpreadsheetIcon />,
    h: 'No spreadsheets',
    p: "Pip values, contract sizes, JPY quirks, gold's 100-oz contract — Edger handles all of it.",
  },
  {
    icon: <SparkIcon />,
    h: 'No brain math',
    p: 'Pip values, distance, and contract size — Edger turns your levels and dollar risk into an exact lot size.',
  },
  {
    icon: <ShieldIcon />,
    h: 'No miscalculation',
    p: 'Direction-aware validation catches reversed stops and sub-1:1 ratios before you click buy.',
  },
];

export function FeatureRow() {
  return (
    <section data-reveal className="relative z-10 px-6 pt-20 md:pt-28 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-px bg-zinc-200/70 border border-zinc-200/70 rounded-2xl overflow-hidden">
        {FEATURES.map((f) => (
          <div key={f.h} className="bg-white p-8 md:p-10 flex flex-col items-center text-center">
            <div className="mb-5 w-11 h-11 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-700">
              {f.icon}
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-950 mb-2">{f.h}</h3>
            <p className="text-sm text-zinc-600 leading-relaxed max-w-xs">{f.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
