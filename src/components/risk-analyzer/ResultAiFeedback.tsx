import type { AiChartFeedbackPayload } from '@/types/analyze-risk-api';

export function ResultAiFeedback({ feedback }: { feedback: AiChartFeedbackPayload }) {
  return (
    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 shrink-0">
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-800 block mb-2">
        Chart notes (AI)
      </span>
      <p className="text-[13px] text-emerald-950 leading-relaxed mb-3">{feedback.chartSummary}</p>
      {feedback.structureNotes.length > 0 && (
        <>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-700 block mb-1.5">
            Structure
          </span>
          <ul className="space-y-1 mb-3">
            {feedback.structureNotes.map((line, i) => (
              <li key={i} className="text-[12px] text-emerald-900 flex gap-2 leading-relaxed">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </>
      )}
      {feedback.caveats.length > 0 && (
        <>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-800 block mb-1.5">
            Caveats
          </span>
          <ul className="space-y-1">
            {feedback.caveats.map((line, i) => (
              <li key={i} className="text-[11px] text-amber-900 flex gap-2 leading-relaxed">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-600 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
