import type { ReactNode } from "react";

export function LoginPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing-root h-svh relative overflow-hidden flex items-center justify-center px-4">
      <div className="landing-aurora absolute inset-x-0 top-0 h-[700px] pointer-events-none z-0" />
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
