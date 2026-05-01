import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { EdgerLogo } from "../components/Logo";

// =============================================================================
// Edger Legal — documentation-style page with tabbed sections
// -----------------------------------------------------------------------------
// /legal           → defaults to Privacy
// /legal#privacy   → Privacy tab
// /legal#terms     → Terms tab
// /legal#disclaimer→ Disclaimer tab
//
// Sidebar tabs on desktop, horizontal scrolling pills on mobile. Active tab is
// synced to URL hash so links can deep-link to the right section.
//
// IMPORTANT: This is reasonable boilerplate, not legal advice. Consult a
// lawyer before going live.
// =============================================================================

type TabId = "privacy" | "terms" | "disclaimer";

const TABS: { id: TabId; label: string }[] = [
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms of Use" },
  { id: "disclaimer", label: "Disclaimer" },
];

const LAST_UPDATED = "May 2026";

export default function Legal() {
  const [activeTab, setActiveTab] = useState<TabId>("privacy");

  // Sync tab to URL hash on mount and when the user uses back/forward.
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1) as TabId;
      if (TABS.some((t) => t.id === hash)) {
        setActiveTab(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleTab = (id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
    // Scroll to top of content on tab change so the user sees the start.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="landing-root min-h-screen relative">
      {/* Background grain */}
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-40 z-0" />

      {/* Soft aurora at the top — same recipe as the rest of the platform,
          gentle so it doesn't compete with body text */}
      <div className="landing-aurora absolute inset-x-0 top-0 h-[420px] pointer-events-none z-0 opacity-50" />

      {/* ── Floating pill nav ── */}
      <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center">
        <nav className="pill-nav rounded-full pl-2 pr-2 py-2 flex items-center gap-1 md:gap-2 max-w-2xl w-full">
          <Link to="/" className="px-3 py-1.5">
            <EdgerLogo size="md" variant="dark" />
          </Link>

          <span className="hidden md:inline-flex items-center gap-2 mx-auto px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 edger-dot-pulse" />
            Legal
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

      {/* ── Main ── */}
      <main className="relative z-10 pt-32 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page header */}
          <header className="mb-12 md:mb-16 max-w-2xl">
            <span className="section-num inline-flex mb-3">Legal</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mt-4 mb-4">
              The fine print.
            </h1>
            <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed">
              Everything that's normally buried at the bottom of a website,
              kept readable and short.
            </p>
          </header>

          {/* Two-column: sidebar + content */}
          <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-14">
            {/* ── Sidebar / tabs ── */}
            <aside className="md:sticky md:top-32 self-start z-10">
              <nav
                className="flex md:flex-col gap-1.5 overflow-x-auto -mx-4 px-4 pb-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0"
                aria-label="Legal sections"
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
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
                  Last updated
                </p>
                <p className="font-mono text-[12px] text-zinc-700">
                  {LAST_UPDATED}
                </p>
              </div>
            </aside>

            {/* ── Content area ── */}
            <article className="min-w-0">
              {activeTab === "privacy" && <PrivacyContent />}
              {activeTab === "terms" && <TermsContent />}
              {activeTab === "disclaimer" && <DisclaimerContent />}

              {/* Mobile-only "Last updated" line */}
              <p className="md:hidden mt-12 pt-6 border-t border-zinc-200 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Last updated · {LAST_UPDATED}
              </p>
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
// Tab content
// =============================================================================

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2>{children}</h2>;
}

function PrivacyContent() {
  return (
    <div className="prose-edger">
      <SectionTitle>Privacy at a glance</SectionTitle>
      <p>
        Edger is currently in early access. This page summarizes what happens
        when you use the app and supporting services like sign-in and the
        waitlist.
      </p>

      <SectionTitle>What we collect</SectionTitle>

      <h3>When you use the analyzer</h3>
      <p>
        The lot-size calculator runs entirely in your browser. Nothing about
        the trades you size is sent to Edger's servers — we don't operate
        servers that receive that data.
      </p>
      <ul>
        <li>
          Any Anthropic API key you provide is stored only in your browser's{" "}
          <code>localStorage</code>. It never leaves your device, except to
          authenticate calls you make to Anthropic.
        </li>
        <li>
          Chart screenshots you upload are sent directly from your browser to
          Anthropic's API for level extraction. Edger does not see, store, or
          intercept these images.
        </li>
        <li>
          App preferences (selected category, recent risk amount) are stored
          locally only.
        </li>
      </ul>

      <h3>When you join the waitlist</h3>
      <p>
        If you submit your email at <code>/waitlist</code>, we store it in our
        database (hosted with Supabase) so we can notify you when sign-ups
        open. Your browser may also remember that you joined so we can show a
        confirmation. We don't sell your email address.
      </p>

      <h3>When you sign in</h3>
      <p>
        Sign-in runs through Clerk. Clerk processes your email verification
        and session; see their privacy policy for how they handle that data.
        Supabase may receive your signed-in session token only for requests the
        app makes on your behalf (for example syncing data you've authorized).
      </p>

      <SectionTitle>Cookies and tracking</SectionTitle>
      <p>
        Edger does not use tracking cookies or third-party analytics beyond what
        authentication providers set for sessions. Local browser storage is
        still used for app preferences and your optional analyzer API key.
      </p>

      <SectionTitle>Third parties</SectionTitle>
      <ul>
        <li>
          <strong>Anthropic</strong> — when you use AI chart extraction, your
          screenshot is sent to{" "}
          <a href="https://www.anthropic.com" target="_blank" rel="noreferrer">
            Anthropic
          </a>
          's API. Their privacy practices apply to that transmission.
        </li>
        <li>
          <strong>Clerk</strong> — manages sign-in sessions and verification.
        </li>
        <li>
          <strong>Supabase</strong> — hosts the database used for waitlist
          signup and optional app data gated by authentication.
        </li>
      </ul>

      <SectionTitle>Data deletion</SectionTitle>
      <p>
        Clearing your browser's site data for Edger removes locally stored
        analyzer settings and keys. Signing out clears your Clerk session here.
        To remove waitlist submissions from our database once we offer that,
        contact us.
      </p>

      <SectionTitle>Contact</SectionTitle>
      <p>
        Questions about privacy:{" "}
        <a href="mailto:hello@edger.app">hello@edger.app</a>.
      </p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose-edger">
      <SectionTitle>Acceptance</SectionTitle>
      <p>
        By using Edger, you agree to these Terms. If you don't agree, please
        don't use the service.
      </p>

      <SectionTitle>What Edger is</SectionTitle>
      <p>
        Edger is an analytical tool that calculates appropriate position sizes
        from inputs you provide — typically a chart screenshot and a dollar
        risk amount. <strong>It is not financial advice.</strong> Edger does not
        recommend trades, predict market movement, or evaluate strategies.
      </p>

      <SectionTitle>Acceptable use</SectionTitle>
      <ul>
        <li>Use Edger for lawful purposes only.</li>
        <li>
          Don't attempt to reverse-engineer, scrape, or disrupt the service.
        </li>
        <li>
          Don't upload content you don't have rights to (for example copyrighted
          chart images you don't have permission to process).
        </li>
      </ul>

      <SectionTitle>Your data</SectionTitle>
      <p>
        You retain all rights to the screenshots, prices, and other content you
        provide. As described in the Privacy section, Edger doesn't store chart
        content on its own servers; waitlist emails and authenticated app data
        may be hosted with providers under our policies above.
      </p>

      <SectionTitle>API key responsibility</SectionTitle>
      <p>
        If you provide your own Anthropic API key, you are responsible for any
        costs incurred and any usage made through it. Keep it secure.
      </p>

      <SectionTitle>No warranties</SectionTitle>
      <p>
        Edger is provided &quot;as is&quot; and &quot;as available&quot; without
        warranties of any kind, express or implied. We don't guarantee
        uninterrupted operation, accuracy of calculations against your specific
        broker's contract sizes, or fitness for any particular trading
        approach.
      </p>

      <SectionTitle>Limitation of liability</SectionTitle>
      <p>
        To the fullest extent allowed by law, Edger and its operators are not
        liable for losses, damages, or claims — direct or indirect — arising
        from your use of the service. Trading involves risk; you accept that
        risk by participating.
      </p>

      <SectionTitle>Changes</SectionTitle>
      <p>
        We may update these Terms at any time during early access. Continued use
        of the service after changes implies acceptance.
      </p>

      <SectionTitle>Termination</SectionTitle>
      <p>
        We may suspend or terminate access to the service at any time, for any
        reason, particularly if these Terms are violated.
      </p>

      <SectionTitle>Contact</SectionTitle>
      <p>
        Questions about these Terms:{" "}
        <a href="mailto:hello@edger.app">hello@edger.app</a>.
      </p>
    </div>
  );
}

function DisclaimerContent() {
  return (
    <div className="prose-edger">
      <SectionTitle>Edger is not financial advice</SectionTitle>
      <p>
        Edger is an analytical tool. It performs arithmetic on inputs you
        provide. It does not advise, recommend, or evaluate any trade,
        strategy, instrument, or broker. Anything you do with the output is your
        own decision.
      </p>

      <SectionTitle>Trading involves risk</SectionTitle>
      <ul>
        <li>
          Trading currencies, indices, metals, and crypto involves substantial
          risk of loss.
        </li>
        <li>
          On leveraged products, you may lose more than your initial deposit.
        </li>
        <li>Past performance is not indicative of future results.</li>
        <li>You should only trade with capital you can afford to lose entirely.</li>
      </ul>

      <SectionTitle>Verify before placing trades</SectionTitle>
      <ul>
        <li>
          Pip values for non-USD-quoted pairs depend on live FX rates that
          Edger does not fetch. Edger uses approximations that are typically
          within ~2% of accurate.
        </li>
        <li>
          Contract sizes vary by broker, especially for indices, metals, and
          crypto. Check your broker's specifications and confirm Edger's
          assumptions match.
        </li>
        <li>
          AI chart extraction is approximate and may misread price levels.
          Always review the extracted entry, stop, and target before
          calculating.
        </li>
      </ul>

      <SectionTitle>Edger is not a broker</SectionTitle>
      <p>
        Edger does not execute trades, hold funds, or maintain any relationship
        with brokers. Edger is not affiliated with any broker whose instruments
        are listed in the app.
      </p>

      <SectionTitle>Consult a professional</SectionTitle>
      <p>
        Consult a licensed financial advisor before making investment decisions.
        The choice of position size, instrument, or strategy depends on your
        individual risk tolerance, financial goals, and circumstances — none of
        which Edger evaluates.
      </p>
    </div>
  );
}
