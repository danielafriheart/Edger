'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { AppPillNav } from '@/components/ui/AppPillNav';
import { JournalMonthHeader } from '@/components/Journal/JournalMonthHeader';
import { JournalCalendar } from '@/components/Journal/JournalCalendar';
import { JournalTable } from '@/components/Journal/JournalTable';
import { JournalEntryModal } from '@/components/Journal/JournalEntryModal';
import { useJournalState } from '@/hooks/useJournalState';

// =============================================================================
// JournalScreen — assembles the /journal page
// -----------------------------------------------------------------------------
// Composes the nav, the month header (year + summary + view toggle + month
// nav + new-entry button), the calendar or table body depending on view mode,
// and the create/edit modal.
//
// Auth gate matches the analyzer: while Clerk is resolving or the user is not
// signed in, render a quiet "Loading…" surface. The signed-in check is also
// enforced server-side by the (protected) route group; this is the client-side
// progressive-enhancement guard.
// =============================================================================

export function JournalScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const j = useJournalState();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      /* still leave locally */
    }
    router.push('/');
  };

  if (!isLoaded || isSignedIn !== true) {
    return (
      <div className="landing-root h-[100svh] flex items-center justify-center text-zinc-500 font-mono text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="landing-root min-h-[100svh] relative flex flex-col">
      {/* Soft brand backdrop, same recipe as analyzer + profile */}
      <div className="landing-grain fixed inset-0 pointer-events-none opacity-50 z-0" />
      <div className="landing-aurora absolute inset-0 pointer-events-none z-0 opacity-30" />

      <AppPillNav currentPage="journal" onLogout={() => void handleLogout()} />

      <main className="flex-1 relative z-10 pt-24 md:pt-28 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto w-full">
          <JournalMonthHeader
            year={j.year}
            month={j.month}
            view={j.view}
            onViewChange={j.setView}
            onPrev={j.goPrev}
            onNext={j.goNext}
            onToday={j.goToday}
            onNew={() => j.openNewEntry()}
            entriesThisMonth={j.entries.filter((e) => {
              const d = e.tradeDate.split('-').map(Number);
              return d[0] === j.year && d[1] - 1 === j.month;
            })}
          />

          {j.loadError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-900 mb-3">
              {j.loadError}
            </div>
          ) : null}

          {j.view === 'calendar' ? (
            <JournalCalendar
              year={j.year}
              month={j.month}
              entries={j.entries}
              onSelectDay={j.handleSelectDay}
            />
          ) : (
            <JournalTable
              entries={j.entries.filter((e) => {
                const d = e.tradeDate.split('-').map(Number);
                return d[0] === j.year && d[1] - 1 === j.month;
              })}
              onSelectEntry={j.openEntry}
            />
          )}

          {j.loading && j.entries.length === 0 ? (
            <p className="mt-3 text-center font-mono text-[11px] text-zinc-500">
              Loading entries…
            </p>
          ) : null}
        </div>
      </main>

      <JournalEntryModal
        open={j.modalOpen}
        entry={j.modalEntry}
        defaultDate={j.modalDefaultDate}
        onClose={j.closeModal}
        onSubmit={j.handleSubmit}
        onDelete={j.handleDelete}
      />
    </div>
  );
}
