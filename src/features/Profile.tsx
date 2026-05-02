import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { EdgerLogo } from "../components/Logo";
import {
  clearSession,
  getSession,
  setSession,
  type PlanId,
  type Session,
} from "../lib/auth";

// =============================================================================
// Edger /profile — sidebar layout (Account / Plan & Billing / Usage)
// -----------------------------------------------------------------------------
// Sidebar nav matches the /legal pattern: vertical tabs on desktop, scrolling
// pills on mobile, sticky position. Tab synced to URL hash.
//
// All data comes from the localStorage session for now. When the backend is
// wired up, replace getSession()/setSession() in src/lib/auth.ts and every
// page automatically pulls real data.
// =============================================================================

type TabId = "account" | "billing" | "usage";

const TABS: { id: TabId; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "billing", label: "Plan & Billing" },
  { id: "usage", label: "Usage" },
];

const PLAN_LABEL: Record<PlanId, string> = {
  free: "Free",
  payg: "Pay as you go",
  pro_monthly: "Pro Monthly",
  pro_annual: "Pro Annual",
};

const PLAN_DESCRIPTION: Record<PlanId, string> = {
  free: "5 AI analyses per month, no card on file.",
  payg: "Pre-paid credits — $0.20 per AI analysis.",
  pro_monthly: "Unlimited AI · billed $19/month.",
  pro_annual: "Unlimited AI · billed $190/year (2 months free).",
};

export default function Profile() {
  const navigate = useNavigate();
  const [session, setLocalSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("account");

  // Auth gate + load session
  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/signup" });
      return;
    }
    setLocalSession(s);
  }, [navigate]);

  // Sync tab to URL hash
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1) as TabId;
      if (TABS.some((t) => t.id === hash)) setActiveTab(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleTab = (id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
  };

  const handleNameSave = (name: string) => {
    if (!session) return;
    const next = { ...session, name };
    setSession(next);
    setLocalSession(next);
  };

  if (!session) {
    return (
      <div className="landing-root h-[100svh] flex items-center justify-center text-zinc-500 font-mono text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="landing-root min-h-screen relative">
      {/* Background grain */}
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-40 z-0" />

      {/* Soft aurora */}
      <div className="landing-aurora absolute inset-x-0 top-0 h-[420px] pointer-events-none z-0 opacity-50" />

      {/* ── Floating pill nav ── */}
      <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
        <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
          <Link to="/" className="px-3 py-1.5">
            <EdgerLogo size="md" variant="dark" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
            Profile
          </span>

          <div className="ml-auto flex items-center gap-1">
            <Link
              to="/app"
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Analyzer
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3.5 py-2 text-sm font-medium rounded-full text-zinc-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* ── Main ── */}
      <main className="relative z-10 pt-32 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page header */}
          <header className="mb-12 md:mb-16 max-w-2xl">
            <span className="section-num inline-flex mb-3">Profile</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mt-4 mb-3">
              {session.name}.
            </h1>
            <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed font-mono">
              {session.email}
            </p>
          </header>

          {/* Two-column: sidebar + content */}
          <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-14">
            {/* Sidebar */}
            <aside className="md:sticky md:top-32 self-start z-10">
              <nav
                className="flex md:flex-col gap-1.5 overflow-x-auto -mx-4 px-4 pb-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0"
                aria-label="Profile sections"
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTab(t.id)}
                    className={`shrink-0 text-left px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === t.id
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>

              <div className="hidden md:block mt-6 pt-6 border-t border-zinc-200">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 mb-1.5">
                  Member since
                </p>
                <p className="font-mono text-[12px] text-zinc-700">
                  {new Date(session.signedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </aside>

            {/* Content */}
            <article className="min-w-0">
              {activeTab === "account" && (
                <AccountSection
                  session={session}
                  onNameSave={handleNameSave}
                />
              )}
              {activeTab === "billing" && <BillingSection session={session} />}
              {activeTab === "usage" && <UsageSection session={session} />}
            </article>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-zinc-100 px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
            © {new Date().getFullYear()} Edger
          </div>
          <div className="font-mono">Analytical tool, not financial advice.</div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// Sections
// =============================================================================

function AccountSection({
  session,
  onNameSave,
}: {
  session: Session;
  onNameSave: (name: string) => void;
}) {
  const [name, setName] = useState(session.name);
  const dirty = name !== session.name && name.trim().length > 0;

  return (
    <div className="space-y-5">
      <SectionCard
        kicker="Identity"
        title="Account info"
        sub="Your name and email. Email is locked once verified."
      >
        <Field label="Full name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
          />
        </Field>

        <Field label="Email">
          <div className="relative">
            <input
              type="email"
              value={session.email}
              readOnly
              className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-3 text-sm font-mono text-zinc-600 cursor-not-allowed pr-20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] uppercase tracking-[0.22em] font-semibold text-emerald-700 font-mono">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Verified
            </span>
          </div>
        </Field>

        {dirty && (
          <button
            onClick={() => onNameSave(name.trim())}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors self-start shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
          >
            Save changes
          </button>
        )}
      </SectionCard>

      <SectionCard
        kicker="Danger zone"
        title="Delete account"
        sub="Permanently remove your account and any usage data."
        tone="danger"
      >
        <button
          onClick={() => alert("Coming soon — this will be wired to the backend.")}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-50 transition-colors self-start"
        >
          Delete my account
        </button>
      </SectionCard>
    </div>
  );
}

function BillingSection({ session }: { session: Session }) {
  const isPro =
    session.plan === "pro_monthly" || session.plan === "pro_annual";
  const isPayg = session.plan === "payg";

  return (
    <div className="space-y-5">
      {/* Active plan card with pastel frame for emphasis */}
      <div className="gradient-frame-mint frame-grain rounded-3xl p-1.5 relative overflow-hidden border border-white/40 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
        <div className="bg-white rounded-[20px] p-6 md:p-7">
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
              Active plan
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] uppercase tracking-[0.22em] font-semibold text-emerald-700 font-mono">
              <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
              Active
            </span>
          </div>
          <div className="mb-5">
            <h3 className="text-3xl md:text-4xl font-bold tracking-[-0.035em] text-zinc-950 mb-2">
              {PLAN_LABEL[session.plan]}
            </h3>
            <p className="text-zinc-600 text-[14px] leading-relaxed">
              {PLAN_DESCRIPTION[session.plan]}
            </p>
          </div>

          {/* Plan-specific stat: credits or quota */}
          {isPayg ? (
            <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5 mb-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
                  Credits remaining
                </div>
                <div className="font-mono text-2xl font-medium tabular-nums tracking-[-0.02em] text-zinc-950">
                  {session.credits}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
                  ≈ Value
                </div>
                <div className="font-mono text-base text-zinc-700 tabular-nums">
                  ${(session.credits * 0.2).toFixed(2)}
                </div>
              </div>
            </div>
          ) : session.plan === "free" ? (
            <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5 mb-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
                  AI analyses left this month
                </div>
                <div className="font-mono text-2xl font-medium tabular-nums tracking-[-0.02em] text-zinc-950">
                  {session.credits} <span className="text-zinc-400 text-base">/ 5</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
                  Resets
                </div>
                <div className="font-mono text-sm text-zinc-700">
                  Monthly
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5 mb-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
                AI analyses
              </div>
              <div className="font-mono text-2xl font-medium tabular-nums tracking-[-0.02em] text-zinc-950">
                Unlimited <span className="text-zinc-400 text-sm">(fair use)</span>
              </div>
            </div>
          )}

          {/* Action row */}
          <div className="flex flex-col sm:flex-row gap-2">
            {!isPro && (
              <Link
                to="/pricing"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}
            {isPayg && (
              <button
                onClick={() => alert("Backend not yet wired.")}
                className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Buy more credits
              </button>
            )}
            {isPro && (
              <button
                onClick={() => alert("Backend not yet wired.")}
                className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
              >
                Manage subscription
              </button>
            )}
            <Link
              to="/pricing"
              className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Compare plans
            </Link>
          </div>
        </div>
      </div>

      {/* Payment method placeholder */}
      <SectionCard
        kicker="Billing"
        title="Payment method"
        sub="Used for Pro subscriptions and PAYG credit purchases."
      >
        <div className="bg-zinc-50 rounded-xl border border-dashed border-zinc-200 px-4 py-5 text-center">
          <p className="text-sm text-zinc-500 mb-3">No payment method on file.</p>
          <button
            onClick={() => alert("Backend not yet wired.")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Add payment method
          </button>
        </div>
      </SectionCard>

      <SectionCard
        kicker="History"
        title="Invoices"
        sub="Your billing history will appear here."
      >
        <p className="font-mono text-[12px] text-zinc-500 italic">
          No invoices yet.
        </p>
      </SectionCard>
    </div>
  );
}

function UsageSection({ session }: { session: Session }) {
  const isPayg = session.plan === "payg";
  const isFree = session.plan === "free";

  return (
    <div className="space-y-5">
      <SectionCard
        kicker="This month"
        title="Activity"
        sub="AI extractions and lot-size calculations performed this billing period."
      >
        <div className="grid grid-cols-3 gap-3">
          <UsageStat label="AI analyses" value="0" />
          <UsageStat label="Calculations" value="0" />
          <UsageStat
            label={isPayg ? "Credits used" : "Spent"}
            value={isPayg ? "0" : "$0.00"}
          />
        </div>

        {isFree && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4 flex items-start gap-3">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <p className="text-[13px] text-amber-900 leading-relaxed">
              Free plan resets to 5 AI analyses on the 1st of every month. Need
              more?{" "}
              <Link
                to="/pricing"
                className="underline underline-offset-2 hover:text-amber-700"
              >
                Compare plans
              </Link>
              .
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard
        kicker="History"
        title="Recent calculations"
        sub="The last lot-size calculations you ran."
      >
        <p className="font-mono text-[12px] text-zinc-500 italic">
          No calculations yet. Head over to the{" "}
          <Link
            to="/app"
            className="underline underline-offset-2 hover:text-zinc-900"
          >
            Analyzer
          </Link>{" "}
          to size your first trade.
        </p>
      </SectionCard>
    </div>
  );
}

// =============================================================================
// Reusable
// =============================================================================

function SectionCard({
  kicker,
  title,
  sub,
  children,
  tone,
}: {
  kicker: string;
  title: string;
  sub?: string;
  children: ReactNode;
  tone?: "danger";
}) {
  const borderClass = tone === "danger" ? "border-rose-200/70" : "border-zinc-200/70";
  return (
    <div
      className={`bg-white rounded-3xl border ${borderClass} p-6 md:p-7 shadow-[0_4px_30px_-12px_rgba(0,0,0,0.07)] flex flex-col gap-4`}
    >
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
          {kicker}
        </span>
        <h2 className="mt-2 text-lg font-semibold text-zinc-950 tracking-tight">
          {title}
        </h2>
        {sub && (
          <p className="text-[13px] text-zinc-500 mt-0.5 leading-relaxed">
            {sub}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-100 px-4 py-3.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-1">
        {label}
      </div>
      <div className="font-mono text-xl font-medium tabular-nums tracking-[-0.02em] text-zinc-950">
        {value}
      </div>
    </div>
  );
}
