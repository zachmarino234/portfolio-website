import type { ReactNode } from "react";
import { themeGradientColor, type SanityHsl } from "@/lib/projectTheme";

// The tinted background band that sits behind the one-pager + content sections
// (Figma nodes 89:400 / 92:273). A hue-derived color fades down into the cream
// page background. The hue comes from the project's cardColor; saturation and
// lightness are held constant for consistent, accessible contrast.
export default function ProjectGradient({
  hsl,
  children,
}: {
  hsl?: SanityHsl | null;
  children: ReactNode;
}) {
  const themeColor = themeGradientColor(hsl);

  return (
    <div className="relative w-full bg-[#faf7f1]">
      {/* Gradient wash: theme color at the top fading to cream partway down. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[982px]"
        style={{
          background: `linear-gradient(to bottom, ${themeColor} 0%, #faf7f1 56%)`,
        }}
      />
      {/* Deferred: mix-blend-color-burn paper texture PNG overlay — user will
          add the asset later. */}
      <div className="relative">{children}</div>
    </div>
  );
}
