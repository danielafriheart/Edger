import { Link } from "@tanstack/react-router";

export function LoginFooterLinks({
  alternateTo,
  alternateLabel,
  alternateSearch,
}: {
  alternateTo?: "/login" | "/signup";
  alternateLabel?: string;
  /** Passed to TanStack Router so /login ↔ /signup can carry e.g. `?email=` when switching flows. */
  alternateSearch?: { email?: string };
} = {}) {
  return (
    <div className="mt-6 text-center space-y-2.5">
      <p className="text-[12px] text-zinc-500 leading-relaxed">
        By continuing, you agree to the{" "}
        <Link to="/legal" hash="terms" className="text-zinc-800 underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/legal" hash="privacy" className="text-zinc-800 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      {alternateTo && alternateLabel ? (
        <Link
          to={alternateTo}
          {...(alternateSearch ? { search: alternateSearch } : {})}
          className="block text-[12px] text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
        >
          {alternateLabel}
        </Link>
      ) : null}
      <Link to="/" className="inline-block text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors">
        ← Back to home
      </Link>
    </div>
  );
}
