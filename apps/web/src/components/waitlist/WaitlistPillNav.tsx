import { Link } from "@tanstack/react-router";
import { EdgerLogo } from "../Logo";

export function WaitlistPillNav() {
  return (
    <div className="absolute top-5 inset-x-0 z-50 px-4 flex justify-center">
      <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
        <Link to="/" className="px-3 py-1.5">
          <EdgerLogo size="md" variant="dark" />
        </Link>

        <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
          Waitlist
        </span>

        <div className="ml-auto">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            ← Home
          </Link>
        </div>
      </nav>
    </div>
  );
}
