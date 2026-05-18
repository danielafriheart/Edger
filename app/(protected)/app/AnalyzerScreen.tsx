'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AnalyzerPillNav } from '@/components/risk-analyzer/AnalyzerNav';
import { ConfigureView } from '@/components/risk-analyzer/ConfigureView';
import { ResultView } from '@/components/risk-analyzer/ResultView';
import { useRiskAnalyzerState } from '@/hooks/useRiskAnalyzerState';

export function AnalyzerScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const state = useRiskAnalyzerState();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      /* keep local navigation behavior */
    }

    router.push('/');
  };

  if (!isLoaded || isSignedIn !== true) {
    return (
      <div className="landing-root h-[100svh] flex items-center justify-center text-zinc-500 font-mono text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="landing-root h-[100svh] relative overflow-hidden flex flex-col">
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />
      <div className="landing-aurora absolute inset-0 pointer-events-none z-0 opacity-30" />

      <AnalyzerPillNav onLogout={() => void handleLogout()} />

      <main className="flex-1 relative z-10 pt-24 md:pt-28 pb-6 px-4 min-h-0 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col">
          {!state.result ? (
            <ConfigureView
              image={state.image}
              dragOver={state.dragOver}
              setDragOver={state.setDragOver}
              onDrop={state.handleDrop}
              onFileInput={state.handleFileInput}
              onRemoveImage={() => state.setImage(null)}
              category={state.category}
              onCategoryChange={state.handleCategoryChange}
              pair={state.pair}
              setPair={state.setPair}
              instrument={state.instrument}
              direction={state.direction}
              setDirection={state.setDirection}
              entry={state.entry}
              setEntry={state.setEntry}
              stopLoss={state.stopLoss}
              setStopLoss={state.setStopLoss}
              takeProfit={state.takeProfit}
              setTakeProfit={state.setTakeProfit}
              risk={state.risk}
              setRisk={state.setRisk}
              onAnalyze={state.handleAnalyze}
              canAnalyze={state.canAnalyze}
              analyzing={state.analyzing}
              analyzeError={state.analyzeError}
            />
          ) : (
            <ResultView
              result={state.result}
              image={state.image}
              aiFeedback={state.aiFeedback}
              persistWarning={state.persistWarning}
              onReset={state.resetAll}
              onCopy={state.copySummary}
            />
          )}
        </div>
      </main>
    </div>
  );
}
