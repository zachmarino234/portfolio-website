// Derives the project page's theme color from the project's `cardColor` hue.
//
// Per the redesign spec, the gradient behind the one-pager takes ONLY the hue
// from the card color; saturation and lightness are held constant so every
// project lands at the same, WCAG-friendly contrast against the cream page and
// the near-black foreground text. Values approximate the Figma top color
// #b9b3ff (~hsl(245, 100%, 85%)).

// Sanity's color plugin stores hue as 0..360 (h), with s/l as 0..100.
export type SanityHsl = { h?: number; s?: number; l?: number; a?: number };

// Held constant across all projects for consistent contrast.
const THEME_SATURATION = 100; // %
const THEME_LIGHTNESS = 85; // %

// Fallback hue (lilac ~245°) used when a project has no cardColor set.
const FALLBACK_HUE = 245;

export function themeGradientColor(hsl?: SanityHsl | null): string {
  const hue = Math.round(hsl?.h ?? FALLBACK_HUE);
  return `hsl(${hue}, ${THEME_SATURATION}%, ${THEME_LIGHTNESS}%)`;
}
