import { formatChartImageLimitKb } from '@/constants/chart-image';

import { ImageIcon } from '../ui/Icons';

export function DropZone({
  image,
  dragOver,
  setDragOver,
  onDrop,
  onFileInput,
}: {
  image: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      tabIndex={0}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center flex-1 min-h-[160px] rounded-2xl cursor-pointer overflow-hidden transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 ${
        dragOver
          ? 'gradient-frame-mint border-2 border-emerald-400/60'
          : image
            ? 'border border-zinc-200 bg-zinc-50'
            : 'border-2 border-dashed border-zinc-200 bg-zinc-50/40 hover:border-zinc-300 hover:bg-zinc-50'
      }`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt="Uploaded chart"
          className="max-h-full max-w-full w-full h-full object-contain"
        />
      ) : (
        <div className="text-center px-6">
          <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 mb-3 shadow-sm">
            <ImageIcon />
          </div>
          <p className="text-sm font-medium text-zinc-800">Drop or paste your chart</p>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono tracking-tight leading-relaxed">
            TradingView: Copy image, paste here — entry, SL &amp; TP auto-fill
          </p>
          <p className="text-[10px] text-zinc-400 mt-1 font-mono tracking-tight">
            Compressed to ≤{formatChartImageLimitKb()} · PNG · JPG · WebP
          </p>
        </div>
      )}
      <input type="file" accept="image/*" onChange={onFileInput} className="hidden" />
    </label>
  );
}
