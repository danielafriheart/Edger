import Link from 'next/link';
import { EdgerLogo } from './Logo';

// =============================================================================
// AppPillNav — single floating-pill nav used across every signed-in page.
// -----------------------------------------------------------------------------
// Replaces the per-page navs (AnalyzerPillNav, JournalPillNav, ProfilePillNav)
// that drifted apart as the platform grew. One source of truth for:
//   • The pill chrome (logo + center indicator + right cluster + Logout)
//   • Which pages are reachable from anywhere in the app
//   • Mobile visibility rules
//
// Adding a new top-level page = add one row to APP_PAGES below; nothing else.
//
// `position` defaults to `fixed`. Pass `absolute` on screens that lock the
// viewport (`h-[100svh] overflow-hidden`) so the nav layers inside the locked
// surface rather than escaping it.
// =============================================================================

export type AppPage = 'analyzer' | 'journal' | 'profile';

const APP_PAGES: Array<{ id: AppPage; label: string; href: string }> = [
  { id: 'analyzer', label: 'Analyzer', href: '/app' },
  { id: 'journal', label: 'Journal', href: '/journal' },
  { id: 'profile', label: 'Profile', href: '/profile' },
];

export interface AppPillNavProps {
  /** Which page the nav is rendering on. Drives the center indicator and
   *  filters this page out of the right-cluster link list. */
  currentPage: AppPage;
  /** Sign-out handler — kept as a prop so each screen can sequence its own
   *  navigation/cleanup around the Clerk signOut() call. */
  onLogout: () => void;
  /** Defaults to `fixed`. Use `absolute` on viewport-locked pages so the nav
   *  layers inside the locked container instead of escaping it. */
  position?: 'fixed' | 'absolute';
}

export function AppPillNav({
  currentPage,
  onLogout,
  position = 'fixed',
}: AppPillNavProps) {
  const currentLabel =
    APP_PAGES.find((p) => p.id === currentPage)?.label ?? '';
  const otherPages = APP_PAGES.filter((p) => p.id !== currentPage);

  return (
    <div
      className={`${position === 'fixed' ? 'fixed' : 'absolute'} top-5 inset-x-0 z-50 px-4 flex justify-center`}
    >
      <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
        <Link href="/" className="px-3 py-1.5">
          <EdgerLogo size="md" variant="dark" />
        </Link>

        <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
          {currentLabel}
        </span>

        <div className="ml-auto flex items-center gap-1">
          {otherPages.map((page) => (
            <Link
              key={page.id}
              href={page.href}
              className="hidden sm:inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              {page.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            aria-label="Sign out"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
