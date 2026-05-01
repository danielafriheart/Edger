export function WaitlistPageFooter() {
  return (
    <footer className="relative z-10 px-6 pb-6 pt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
      <span>© {new Date().getFullYear()} Edger</span>
      <span className="flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-emerald-500" />
        Sign-ups opening soon
      </span>
    </footer>
  );
}
