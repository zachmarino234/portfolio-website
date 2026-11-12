// Derives the project page's theme color from the project's `cardColor` hue.
//
// Per the redesign spec, the gradient behind the one-pager takes ONLY the hue
// from the card color; saturation and lightness are held constant so every
// project lands at the same, WCAG-friendly contrast against the cream page and
// the near-black foreground text. Values approximate the Figma top color
// #b9b3ff (~hsl(245, 100%, 85%)).

// Held constant across all projects for consistent contrast.
const THEME_SATURATION = 100; // %
const THEME_LIGHTNESS = 85; // %

// Fallback hue (lilac ~245°) used when a project has no cardColor set.
const FALLBACK_HUE = 245;

/** Hue (0–360) of a #rgb / #rrggbb color, or undefined if it can't be read. */
export function hexToHue(hex?: string | null): number | undefined {
  if (!hex) return undefined;
  let value = hex.trim().replace(/^#/, "");
  if (value.length === 3) value = value.replace(/./g, (c) => c + c);
  if (!/^[0-9a-f]{6}$/i.test(value)) return undefined;

  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0; // greys have no hue

  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return (hue * 60 + 360) % 360;
}

export function themeGradientColor(cardColor?: string | null): string {
  const hue = Math.round(hexToHue(cardColor) ?? FALLBACK_HUE);
  return `hsl(${hue}, ${THEME_SATURATION}%, ${THEME_LIGHTNESS}%)`;
}
