import type { ReactNode } from "react";
import { EdgerLogo } from "../ui/Logo";

/** Mint gradient shell from dev `/signup`; inner content fills the rounded card body. */
export function SignupPageChrome({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="landing-root min-h-screen relative overflow-x-hidden flex items-center justify-center px-4 py-12">
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />
      <div className="landing-aurora absolute inset-x-0 top-0 h-[700px] pointer-events-none z-0 opacity-50" />

      <div className="relative z-10 w-full max-w-md">
        <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
          <div className="bg-white rounded-[20px] p-7 md:p-9">
            <div className="flex justify-center mb-7">
              <EdgerLogo size="lg" variant="dark" />
            </div>
            {children}
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
