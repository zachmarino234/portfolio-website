"use client";

import { useEffect, useRef, useState } from "react";
import HeroStickerContent from "./HeroStickerContent";
import { heroLayout, stickerStyle, type HeroItem } from "./heroLayout";

// Dev-only visual editor for the hero collage. Mounted only in development (see
// app/page.tsx) and only takes over the screen when the URL has `?edit`.
//
// Drag a sticker to move it, drag the corner dot to resize, drag the top dot to
// rotate; arrow keys nudge the selected sticker and [ ] rotate it. "Copy layout"
// puts an updated `heroLayout` array on your clipboard — paste it over the array
// in heroLayout.ts to persist. Nothing here ships to production.

const clone = (items: HeroItem[]) => items.map((i) => ({ ...i }));
const round = (n: number, d = 1) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

const FIELD_ORDER: (keyof HeroItem)[] = [
  "id", "kind", "x", "y", "rotation", "z", "width", "scale",
  "src", "alt", "imgWidth", "imgHeight", "href", "external", "label", "priority",
];

// Serialize state back into a `heroLayout` array literal for pasting into heroLayout.ts.
function serialize(items: HeroItem[]): string {
  const body = items
    .map((item) => {
      const parts = FIELD_ORDER.filter((k) => item[k] !== undefined).map((k) => {
        const v = item[k];
        let out: string;
        if (typeof v === "string") out = JSON.stringify(v);
        else if (typeof v === "boolean") out = String(v);
        else if (k === "scale") out = String(round(v as number, 3));
        else if (k === "x" || k === "y" || k === "width" || k === "rotation") out = String(round(v as number, 1));
        else out = String(v);
        return `${k}: ${out}`;
      });
      return `  { ${parts.join(", ")} },`;
    })
    .join("\n");
  return `export const heroLayout: HeroItem[] = [\n${body}\n];`;
}

// Bottom→top stacking order (by z, ties broken by array position — matching how
// the browser paints equal-z siblings).
const stackingOrder = (items: HeroItem[]): string[] =>
  items
    .map((it, i) => ({ id: it.id, z: it.z, i }))
    .sort((a, b) => a.z - b.z || a.i - b.i)
    .map((e) => e.id);

// Reassign clean z values (10, 20, 30, …) from a bottom→top list of ids.
const restack = (items: HeroItem[], orderedIds: string[]): HeroItem[] => {
  const zById = new Map(orderedIds.map((id, i) => [id, (i + 1) * 10]));
  return items.map((it) => ({ ...it, z: zById.get(it.id) ?? it.z }));
};

type LayerMove = "front" | "back" | "forward" | "backward";

type Gesture =
  | { type: "move"; id: string; px: number; py: number; startX: number; startY: number; rect: DOMRect }
  | { type: "resize"; id: string; cx: number; cy: number; startDist: number; startWidth?: number; startScale: number }
  | { type: "rotate"; id: string; cx: number; cy: number; startAngle: number; startRotation: number };

const NUDGE_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "[", "]"];

export default function HeroEditor() {
  const [active, setActive] = useState(false);
  const [items, setItems] = useState<HeroItem[]>(() => clone(heroLayout));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);

  // Activate on `?edit`; react to back/forward navigation.
  useEffect(() => {
    const check = () => setActive(new URLSearchParams(window.location.search).has("edit"));
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, []);

  // Keyboard nudging of the selected sticker.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId || !NUDGE_KEYS.includes(e.key)) return;
      e.preventDefault();
      const step = e.shiftKey ? 1 : 0.2;
      const rot = e.shiftKey ? 2 : 0.5;
      setItems((prev) =>
        prev.map((i) => {
          if (i.id !== selectedId) return i;
          switch (e.key) {
            case "ArrowLeft": return { ...i, x: round(i.x - step) };
            case "ArrowRight": return { ...i, x: round(i.x + step) };
            case "ArrowUp": return { ...i, y: round(i.y - step) };
            case "ArrowDown": return { ...i, y: round(i.y + step) };
            case "[": return { ...i, rotation: round(i.rotation - rot) };
            case "]": return { ...i, rotation: round(i.rotation + rot) };
            default: return i;
          }
        }),
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, selectedId]);

  const update = (id: string, patch: Partial<HeroItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const moveLayer = (dir: LayerMove) => {
    if (!selectedId) return;
    setItems((prev) => {
      const order = stackingOrder(prev);
      const idx = order.indexOf(selectedId);
      if (idx === -1) return prev;
      const next = order.filter((id) => id !== selectedId);
      const insertAt =
        dir === "front" ? next.length
        : dir === "back" ? 0
        : dir === "forward" ? Math.min(idx + 1, next.length)
        : Math.max(idx - 1, 0);
      next.splice(insertAt, 0, selectedId);
      return restack(prev, next);
    });
  };

  const centerOf = (item: HeroItem, rect: DOMRect) => ({
    cx: rect.left + (item.x / 100) * rect.width,
    cy: rect.top + (item.y / 100) * rect.height,
  });

  const startMove = (e: React.PointerEvent<HTMLElement>, item: HeroItem) => {
    e.stopPropagation();
    setSelectedId(item.id);
    const rect = stageRef.current!.getBoundingClientRect();
    gesture.current = { type: "move", id: item.id, px: e.clientX, py: e.clientY, startX: item.x, startY: item.y, rect };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startResize = (e: React.PointerEvent<HTMLElement>, item: HeroItem) => {
    e.stopPropagation();
    const rect = stageRef.current!.getBoundingClientRect();
    const { cx, cy } = centerOf(item, rect);
    gesture.current = {
      type: "resize", id: item.id, cx, cy,
      startDist: Math.hypot(e.clientX - cx, e.clientY - cy),
      startWidth: item.width, startScale: item.scale ?? 1,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startRotate = (e: React.PointerEvent<HTMLElement>, item: HeroItem) => {
    e.stopPropagation();
    const rect = stageRef.current!.getBoundingClientRect();
    const { cx, cy } = centerOf(item, rect);
    gesture.current = {
      type: "rotate", id: item.id, cx, cy,
      startAngle: Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI),
      startRotation: item.rotation,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (g.type === "move") {
      const dx = ((e.clientX - g.px) / g.rect.width) * 100;
      const dy = ((e.clientY - g.py) / g.rect.height) * 100;
      update(g.id, { x: round(g.startX + dx), y: round(g.startY + dy) });
    } else if (g.type === "resize") {
      const factor = g.startDist === 0 ? 1 : Math.hypot(e.clientX - g.cx, e.clientY - g.cy) / g.startDist;
      if (g.startWidth != null) update(g.id, { width: Math.max(1, round(g.startWidth * factor)) });
      else update(g.id, { scale: Math.max(0.1, round(g.startScale * factor, 3)) });
    } else {
      const angle = Math.atan2(e.clientY - g.cy, e.clientX - g.cx) * (180 / Math.PI);
      update(g.id, { rotation: round(g.startRotation + (angle - g.startAngle)) });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    gesture.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serialize(items));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — use the textarea below */
    }
  };

  if (!active) return null;

  const selected = items.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-auto bg-gradient-to-b from-[#dfb3ff] to-[#faf7f1] to-[60%] select-none">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-black/10 bg-white/80 px-4 py-2 text-sm backdrop-blur">
        <span className="font-semibold text-[#1e1e1e]">Hero editor</span>
        <button onClick={copy} className="rounded bg-[#1e1e1e] px-3 py-1 font-medium text-white">
          {copied ? "Copied!" : "Copy layout"}
        </button>
        <button
          onClick={() => {
            setItems(clone(heroLayout));
            setSelectedId(null);
          }}
          className="rounded border border-black/20 px-3 py-1 text-[#1e1e1e]"
        >
          Reset
        </button>
        {selected && (
          <>
            <span className="font-mono text-xs text-black/60">
              {selected.id}: x {selected.x} · y {selected.y} ·{" "}
              {selected.width != null ? `w ${selected.width}` : `scale ${selected.scale ?? 1}`} · rot {selected.rotation}°
            </span>
            <span className="flex items-center gap-1">
              <span className="text-xs text-black/45">layer:</span>
              <button onClick={() => moveLayer("back")} title="Send to back" className="rounded border border-black/20 px-2 py-1 text-xs text-[#1e1e1e]">⤓</button>
              <button onClick={() => moveLayer("backward")} title="Send backward" className="rounded border border-black/20 px-2 py-1 text-xs text-[#1e1e1e]">↓</button>
              <button onClick={() => moveLayer("forward")} title="Bring forward" className="rounded border border-black/20 px-2 py-1 text-xs text-[#1e1e1e]">↑</button>
              <button onClick={() => moveLayer("front")} title="Bring to front" className="rounded border border-black/20 px-2 py-1 text-xs text-[#1e1e1e]">⤒</button>
            </span>
          </>
        )}
        <span className="ml-auto text-xs text-black/45">drag = move · corner = resize · top dot = rotate · arrows / [ ] = nudge</span>
      </div>

      {/* Stage replica (same classes as HeroPlaceholder so cqw math matches) */}
      <div className="flex min-h-[calc(100vh-3rem)] items-center px-6 py-16">
        <div
          ref={stageRef}
          onPointerDown={() => setSelectedId(null)}
          className="@container relative mx-auto aspect-[2.6/1] w-full max-w-5xl"
        >
          {items.map((item) => {
            const isSel = item.id === selectedId;
            return (
              <div
                key={item.id}
                style={stickerStyle(item)}
                onPointerDown={(e) => startMove(e, item)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className={`cursor-move touch-none ${isSel ? "outline-2 outline-dashed outline-[#1e1e1e]" : ""}`}
              >
                <div className="pointer-events-none w-full">
                  <HeroStickerContent item={item} editing />
                </div>

                {isSel && (
                  <>
                    <span
                      onPointerDown={(e) => startRotate(e, item)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      title="Rotate"
                      className="absolute -top-7 left-1/2 h-4 w-4 -translate-x-1/2 cursor-grab touch-none rounded-full border-2 border-[#1e1e1e] bg-white"
                    />
                    <span
                      onPointerDown={(e) => startResize(e, item)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      title="Resize"
                      className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize touch-none rounded-sm border-2 border-[#1e1e1e] bg-white"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Clipboard fallback: select-all and copy if the button is blocked. */}
      <div className="mx-auto w-full max-w-5xl px-6 pb-16">
        <p className="mb-1 text-xs text-black/45">Paste this over the `heroLayout` array in components/home/heroLayout.ts:</p>
        <textarea
          readOnly
          value={serialize(items)}
          onFocus={(e) => e.currentTarget.select()}
          className="h-48 w-full rounded border border-black/10 bg-white/70 p-3 font-mono text-xs text-[#1e1e1e]"
        />
      </div>
    </div>
  );
}
