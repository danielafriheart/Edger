'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AnalyzerPillNav } from '../../components/risk-analyzer/AnalyzerNav';
import { ConfigureView } from '../../components/risk-analyzer/ConfigureView';
import { ResultView } from '../../components/risk-analyzer/ResultView';
import { useRiskAnalyzerState } from './useRiskAnalyzerState';

export default function RiskAnalyzer() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const s = useRiskAnalyzerState();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      /* still leave the app locally */
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
    <div className="landing-root h-[100svh] relative overflow-hidden flex flex-col">
      <div className="landing-grain absolute inset-0 pointer-events-none opacity-50 z-0" />
      <div className="landing-aurora absolute inset-0 pointer-events-none z-0 opacity-30" />

      <AnalyzerPillNav onLogout={() => void handleLogout()} />

      <main className="flex-1 relative z-10 pt-24 md:pt-28 pb-6 px-4 min-h-0 flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col">
          {!s.result ? (
            <ConfigureView
              image={s.image}
              dragOver={s.dragOver}
              setDragOver={s.setDragOver}
              onDrop={s.handleDrop}
              onFileInput={s.handleFileInput}
              onRemoveImage={() => s.setImage(null)}
              category={s.category}
              onCategoryChange={s.handleCategoryChange}
              pair={s.pair}
              setPair={s.setPair}
              instrument={s.instrument}
              direction={s.direction}
              setDirection={s.setDirection}
              entry={s.entry}
              setEntry={s.setEntry}
              stopLoss={s.stopLoss}
              setStopLoss={s.setStopLoss}
              takeProfit={s.takeProfit}
              setTakeProfit={s.setTakeProfit}
              risk={s.risk}
              setRisk={s.setRisk}
              onAnalyze={s.handleAnalyze}
              canAnalyze={s.canAnalyze}
              analyzing={s.analyzing}
              analyzeError={s.analyzeError}
            />
          ) : (
            <ResultView
              result={s.result}
              image={s.image}
              aiFeedback={s.aiFeedback}
              persistWarning={s.persistWarning}
              onReset={s.resetAll}
              onCopy={s.copySummary}
            />
          )}
        </div>
      </main>
    </div>
  );
}
