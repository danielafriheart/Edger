'use client';

import { SparkleIcon } from '../ui/Icons';

// =============================================================================
// ChartUploadCompact
// -----------------------------------------------------------------------------
// Inline, single-row chart upload that sits at the top of the setup form.
// Replaces the previous full-card DropZone. Two visual states:
//   • Empty   → dashed pill: "Drop a chart for AI insight"
//   • Filled  → solid pill with thumbnail + filename + remove button
// Supports drag-and-drop and click-to-browse. Optional — the analyzer works
// without a chart.
// =============================================================================

export interface ChartUploadCompactProps {
  image: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function ChartUploadCompact({
  image,
  dragOver,
  setDragOver,
  onDrop,
  onFileInput,
  onRemove,
}: ChartUploadCompactProps) {
  if (image) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-200/70 bg-white shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Chart thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[12px] text-emerald-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 edger-dot-pulse" />
            Chart attached
          </div>
          <div className="text-[11px] text-emerald-700/70 font-mono">
            AI insight will be included with your result
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] text-zinc-500 hover:text-rose-700 transition-colors px-2 py-1 rounded-md hover:bg-rose-50 shrink-0"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all border-2 border-dashed ${
        dragOver
          ? 'bg-emerald-50 border-emerald-400'
          : 'bg-zinc-50/60 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
      }`}
    >
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          dragOver
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-white border border-zinc-200 text-zinc-500'
        }`}
      >
        <SparkleIcon />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-zinc-800">
          {dragOver ? 'Drop to attach' : 'Drop a chart for AI insight'}
        </div>
        <div className="text-[11px] text-zinc-500 font-mono">
          PNG · JPG · WebP · optional
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={onFileInput}
        className="hidden"
      />
    </label>
  );
}
