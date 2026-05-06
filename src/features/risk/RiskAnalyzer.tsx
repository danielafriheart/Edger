'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AnalyzerPillNav } from '../../components/risk-analyzer/AnalyzerNav';
import { ConfigureView } from '../../components/risk-analyzer/ConfigureView';
import { ResultView } from '../../components/risk-analyzer/ResultView';
import { SettingsDrawer } from '../../components/risk-analyzer/SettingsDrawer';
import { useRiskAnalyzerState } from './useRiskAnalyzerState';

export default function RiskAnalyzer() {
  const router = useRouter();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const s = useRiskAnalyzerState();

  const handleLogout = async () => {
    s.setSettingsOpen(false);
    s.clearStoredApiKey();
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

      <AnalyzerPillNav onOpenSettings={s.openSettingsWithDraft} onLogout={() => void handleLogout()} />

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
              aiLoading={s.vision.aiLoading}
              aiError={s.vision.aiError}
              aiRationale={s.vision.aiRationale}
              hasApiKey={!!s.apiKey}
              onRunAi={() => void s.vision.runAi(s.image, s.apiKey)}
              onAnalyze={s.handleAnalyze}
              canAnalyze={s.canAnalyze}
            />
          ) : (
            <ResultView result={s.result} image={s.image} onReset={s.resetAll} onCopy={s.copySummary} />
          )}
        </div>
      </main>

      {s.settingsOpen && (
        <SettingsDrawer
          apiKeyDraft={s.apiKeyDraft}
          setApiKeyDraft={s.setApiKeyDraft}
          onSave={s.saveApiKey}
          onClose={() => s.setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
