// =============================================================================
// ProfileNav — only `ProfileFooter` lives here now.
// -----------------------------------------------------------------------------
// The pill nav that used to live in this file was consolidated into
// `components/ui/AppPillNav`. The footer stays here because it's specific to
// the profile page (different copy, sticky bottom-of-content layout) and
// isn't shared with other screens.
// =============================================================================

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
