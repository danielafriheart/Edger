export function ChartExtractStatus({
  extracting,
  error,
  notice,
  warnings,
}: {
  extracting: boolean;
  error: string | null;
  notice: string | null;
  warnings: string[];
}) {
  if (!extracting && !error && !notice && warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5" role="status" aria-live="polite">
      {extracting ? (
        <p className="text-[11px] text-emerald-700 font-medium">
          Reading instrument and trade zone levels…
        </p>
      ) : null}
      {notice ? <p className="text-[11px] text-emerald-800 font-medium">{notice}</p> : null}
      {error ? <p className="text-[11px] text-rose-700">{error}</p> : null}
      {warnings.map((w) => (
        <p key={w} className="text-[11px] text-amber-800">
          {w}
        </p>
      ))}
    </div>
  );
}
