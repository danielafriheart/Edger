import Link from 'next/link';
import { EdgerLogo } from '../ui/Logo';

export function ProfilePillNav({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
      <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
        <Link href="/" className="px-3 py-1.5">
          <EdgerLogo size="md" variant="dark" />
        </Link>

        <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
          Profile
        </span>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/app"
            className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Analyzer
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

export function ProfileFooter() {
  return (
    <footer className="relative z-10 border-t border-zinc-100 px-6 py-8 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
          © {new Date().getFullYear()} Edger
        </div>
        <div className="font-mono">Analytical tool, not financial advice.</div>
      </div>
    </footer>
  );
}
