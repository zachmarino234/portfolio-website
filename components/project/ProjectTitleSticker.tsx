"use client";

// The project headline rendered as a yellow "sticker" (Figma node 88:335).
// The accent yellow is a fixed brand color across all projects, matching the
// home page name sticker. The sticker straddles the hero image / gradient
// boundary (positioning handled by the parent).
//
// The title stays on a single line (whitespace-nowrap). On narrow screens a
// long title would run past the viewport edge, so we measure the sticker's
// natural width against the space to its right and scale the whole element
// down to fit. transform-origin is bottom-left so it stays anchored to the
// left edge and keeps straddling the hero boundary as it shrinks.

import { useLayoutEffect, useRef, useState } from "react";

const ACCENT_YELLOW = "#ffd603";
const RIGHT_GAP = 16; // px of breathing room from the viewport's right edge

export default function ProjectTitleSticker({ title }: { title: string }) {
  const stickerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = stickerRef.current;
    if (!el) return;

    const fit = () => {
      // offsetWidth is the layout (untransformed) width; rect.left is stable
      // because transform-origin is the bottom-left corner.
      const natural = el.offsetWidth;
      const left = el.getBoundingClientRect().left;
      const available = window.innerWidth - left - RIGHT_GAP;
      setScale(natural > 0 ? Math.min(1, available / natural) : 1);
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [title]);

  return (
    <div
      ref={stickerRef}
      className="relative inline-block overflow-hidden rounded-lg border-[5px] border-[#eaeaea] px-3 py-3 shadow-[0_1px_1px_0_rgba(0,0,0,0.25)]"
      style={{
        backgroundColor: ACCENT_YELLOW,
        transform: `scale(${scale})`,
        transformOrigin: "bottom left",
      }}
    >
      <h1 className="whitespace-nowrap font-bold tracking-[-0.02em] text-[#282828] text-2xl leading-tight sm:text-4xl">
        {title}
      </h1>

      {/* Crumpled-poster paper texture. Sits on top with mix-blend-multiply so
          the creases cross the whole sticker; the texture is mostly white, so it
          only subtly darkens the yellow and barely touches the dark text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-multiply"
        style={{ backgroundImage: "url('/images/textures/paper-texture.jpg')" }}
      />
    </div>
  );
}
