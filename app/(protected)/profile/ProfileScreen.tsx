"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountSection } from "@/components/profile/AccountSection";
import { BillingSection } from "@/components/profile/BillingSection";
import { AppPillNav } from "@/components/ui/AppPillNav";
import { ProfileFooter } from "@/components/profile/ProfileNav";
import { UsageSection } from "@/components/profile/UsageSection";
import { splitFullNameForClerk } from "@/lib/auth/fullNameDerived";
import { loadEdgerBilling, type EdgerBillingSlice } from "@/lib/edger-billing-local";

type TabId = "account" | "billing" | "usage";

const TABS: { id: TabId; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "billing", label: "Plan & Billing" },
  { id: "usage", label: "Usage" },
];

function displayNameFromClerk(user: NonNullable<ReturnType<typeof useUser>["user"]>) {
  const full = user.fullName?.trim();
  if (full) return full;

  const parts = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (parts) return parts;

  return user.primaryEmailAddress?.emailAddress ?? "Trader";
}

export function ProfileScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [billing, setBilling] = useState<EdgerBillingSlice>(() => loadEdgerBilling());
  const [activeTab, setActiveTab] = useState<TabId>("account");

  useEffect(() => {
    const syncBilling = () => setBilling(loadEdgerBilling());
    const onVisible = () => {
      if (document.visibilityState === "visible") syncBilling();
    };

    syncBilling();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", syncBilling);
    window.addEventListener("storage", syncBilling);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", syncBilling);
      window.removeEventListener("storage", syncBilling);
    };
  }, []);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1) as TabId;
      if (TABS.some((tab) => tab.id === hash)) setActiveTab(hash);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleTab = (id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      /* keep local navigation behavior */
    }

    router.push("/");
  };

  const handleNameSave = async (name: string) => {
    if (!user) return;

    const { firstName, lastName } = splitFullNameForClerk(name);
    await user.update({ firstName, lastName });
  };

  if (!isLoaded || !isSignedIn || !user) {
    return <div className="landing-root h-[100svh] flex items-center justify-center text-zinc-500 font-mono text-sm">Loading...</div>;
  }

  const displayName = displayNameFromClerk(user);
  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "-";

  return (
    <div className="landing-root min-h-screen relative">
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-40 z-0" />
      <div className="landing-aurora absolute inset-x-0 top-0 h-[420px] pointer-events-none z-0 opacity-50" />

      <AppPillNav currentPage="profile" onLogout={() => void handleLogout()} />

      <main className="relative z-10 pt-32 md:pt-36 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 md:mb-16 max-w-2xl">
            <span className="section-num inline-flex mb-3">Profile</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-[-0.035em] leading-[1.05] text-zinc-950 mt-4 mb-3">{displayName}.</h1>
            <p className="text-zinc-600 text-base md:text-[17px] leading-relaxed font-mono">{email}</p>
          </header>

          <div className="grid md:grid-cols-[220px_1fr] gap-10 md:gap-14">
            <aside className="md:sticky md:top-32 self-start z-10">
              <nav
                className="flex md:flex-col gap-1.5 overflow-x-auto -mx-4 px-4 pb-2 md:overflow-visible md:pb-0 md:mx-0 md:px-0"
                aria-label="Profile sections"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTab(tab.id)}
                    className={`shrink-0 text-left px-3.5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="hidden md:block mt-6 pt-6 border-t border-zinc-200">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 mb-1.5">Member since</p>
                <p className="font-mono text-[12px] text-zinc-700">{memberSince}</p>
              </div>
            </aside>

            <article className="min-w-0">
              {activeTab === "account" && <AccountSection displayName={displayName} email={email} onNameSave={handleNameSave} />}
              {activeTab === "billing" && <BillingSection billing={billing} />}
              {activeTab === "usage" && <UsageSection billing={billing} />}
            </article>
          </div>
        </div>
      </main>

      <ProfileFooter />
    </div>
  );
}
