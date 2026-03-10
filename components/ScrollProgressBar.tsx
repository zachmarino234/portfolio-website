"use client";

import { useEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD = 99;

export default function ScrollProgressBar() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const next = current + (target - current) * 0.18;

      currentProgressRef.current = next;

      if (barRef.current) {
        barRef.current.style.width = `${next}%`;
      }

      const shouldContinue = Math.abs(target - next) > 0.05;
      if (shouldContinue) {
        rafRef.current = window.requestAnimationFrame(animate);
      } else {
        currentProgressRef.current = target;
        if (barRef.current) {
          barRef.current.style.width = `${target}%`;
        }
        rafRef.current = null;
      }
    };

    const updateProgress = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        doc.clientHeight,
        doc.scrollHeight,
        doc.offsetHeight,
      );
      const clientHeight = window.innerHeight || doc.clientHeight;
      const scrollableHeight = scrollHeight - clientHeight;

      if (scrollableHeight <= 0) {
        targetProgressRef.current = 100;
        setIsAtBottom(true);
        if (rafRef.current === null) {
          rafRef.current = window.requestAnimationFrame(animate);
        }
        return;
      }

      const nextProgress = (scrollTop / scrollableHeight) * 100;
      const bounded = Math.min(100, Math.max(0, nextProgress));

      targetProgressRef.current = bounded;
      setIsAtBottom(bounded >= BOTTOM_THRESHOLD);

      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    updateProgress();

    if (barRef.current) {
      barRef.current.style.width = "0%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="pointer-events-none fixed bottom-0 left-0 z-50 h-1 w-full bg-white/20" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full bg-white will-change-[width]"
        />
      </div>

      {isAtBottom && (
        <button
          type="button"
          onClick={handleBackToTop}
          className="fixed right-4 bottom-5 z-50 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity"
        >
          Back to top ↑
        </button>
      )}
    </>
  );
}