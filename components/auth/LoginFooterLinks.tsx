import Link from "next/link";

export function LoginFooterLinks({
  alternateTo,
  alternateLabel,
  alternateSearch,
}: {
  alternateTo?: "/login" | "/signup";
  alternateLabel?: string;
  /** Carry e.g. `?email=` when switching between /login ↔ /signup. */
  alternateSearch?: { email?: string };
} = {}) {
  const alternateHref = (() => {
    if (!alternateTo) return null;
    const params = new URLSearchParams();
    if (alternateSearch?.email) params.set("email", alternateSearch.email);
    const qs = params.toString();
    return qs ? `${alternateTo}?${qs}` : alternateTo;
  })();

  return (
    <div className="mt-6 text-center space-y-2.5">
      <p className="text-[12px] text-zinc-500 leading-relaxed">
        By continuing, you agree to the{" "}
        <Link href="/legal#terms" className="text-zinc-800 underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal#privacy" className="text-zinc-800 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      {alternateHref && alternateLabel ? (
        <Link
          href={alternateHref}
          className="block text-[12px] text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
        >
          {alternateLabel}
        </Link>
      ) : null}
      <Link href="/" className="inline-block text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors">
        ← Back to home
      </Link>
    </div>
  );
}
