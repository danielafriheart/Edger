import { Link } from "@tanstack/react-router";

export function LoginFooterLinks() {
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
      <Link to="/" className="inline-block text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors">
        ← Back to home
      </Link>
    </div>
  );
}
