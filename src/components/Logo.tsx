// =============================================================================
// Edger Logo — single source of truth for the brand mark and wordmark.
// -----------------------------------------------------------------------------
// Composition:
//   • EdgerMark:  the bare SVG glyph (mountain peaks + sun). Inherits color
//                 from `currentColor`, sizes via the `size` prop.
//   • EdgerLogo:  badge wrapper (rounded square) + EdgerMark + "Edger" wordmark.
//                 Two variants — "dark" (zinc-900 badge, used on light pages)
//                 and "light" (translucent white badge, used on dark surfaces).
//
// Same glyph is used as the favicon (public/favicon.svg) so the brand is
// identical from the OS tab through the marketing site to the in-app header.
// =============================================================================

import type { CSSProperties } from "react";

export type EdgerMarkProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export function EdgerMark({ size = 16, className = "", style }: EdgerMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Sun, sitting just above the right peak */}
      <circle cx="17" cy="5" r="1.9" />
      {/* Two-peak ridge */}
      <path d="M3 20 L9 10 L13 14 L17 9 L21 20 Z" />
    </svg>
  );
}

// -----------------------------------------------------------------------------

export type EdgerLogoSize = "sm" | "md" | "lg" | "xl";
export type EdgerLogoVariant = "dark" | "light";

const SIZES: Record<
  EdgerLogoSize,
  { box: string; icon: number; gap: string; text: string }
> = {
  sm: { box: "w-6 h-6 rounded-md", icon: 11, gap: "gap-2", text: "text-[13px]" },
  md: { box: "w-7 h-7 rounded-lg", icon: 13, gap: "gap-2", text: "text-[15px]" },
  lg: { box: "w-9 h-9 rounded-xl", icon: 17, gap: "gap-2.5", text: "text-base" },
  xl: { box: "w-14 h-14 rounded-2xl", icon: 24, gap: "gap-3", text: "" },
};

export function EdgerLogo({
  size = "md",
  variant = "dark",
  showWordmark = true,
  className = "",
}: {
  size?: EdgerLogoSize;
  variant?: EdgerLogoVariant;
  showWordmark?: boolean;
  className?: string;
}) {
  const s = SIZES[size];

  const badgeStyle =
    variant === "dark"
      ? "bg-zinc-900 text-white"
      : "bg-white/10 border border-white/15 text-white backdrop-blur";

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <span
        className={`${s.box} ${badgeStyle} flex items-center justify-center shrink-0`}
      >
        <EdgerMark size={s.icon} />
      </span>
      {showWordmark && (
        <span className={`font-semibold tracking-tight ${s.text}`}>Edger</span>
      )}
    </span>
  );
}
