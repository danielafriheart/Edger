import Link from 'next/link';
import type { ReactNode } from 'react';
import { EdgerLogo } from '../ui/Logo';

export function LandingPillNav() {
  return (
    <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
      <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-3xl w-full">
        <Link href="/" className="px-3 py-1.5">
          <EdgerLogo size="md" variant="dark" />
        </Link>

        <div className="hidden md:flex items-center gap-1 mx-auto">
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#instruments">Instruments</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/waitlist"
            className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Join waitlist
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            Try Edger
          </Link>
        </div>
      </nav>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="px-3 py-1.5 text-sm font-medium text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
    >
      {children}
    </a>
  );
}

export function Pill({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-[12px] font-medium text-zinc-700 ${className}`}
    >
      {children}
    </span>
  );
}
