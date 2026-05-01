import type { ReactNode } from "react";
import { EdgerLogo } from "../Logo";

export function LoginAuthCard({
  title,
  subtitle,
  children,
  footerNote,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerNote: string;
}) {
  return (
    <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
      <div className="bg-white rounded-[20px] p-7 md:p-9">
        <div className="flex justify-center mb-6">
          <EdgerLogo size="lg" variant="dark" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-[28px] md:text-[34px] font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mb-3">
            {title}
          </h1>
          <p className="text-zinc-600 text-[14px] md:text-[15px] leading-relaxed max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        {children}

        <div className="flex items-center justify-center gap-2 mt-7 pt-6 border-t border-zinc-100 font-mono text-[11px] tracking-tight text-zinc-500 leading-relaxed">
          <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse shrink-0" />
          {footerNote}
        </div>
      </div>
    </div>
  );
}
