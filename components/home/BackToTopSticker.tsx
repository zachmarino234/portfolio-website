"use client";

import { useEffect, useState } from "react";

// A "sticker" that appears once the user scrolls past the first viewport, then
// floats fixed in the bottom-right corner (with padding from the edges) for the
// rest of the page. Hidden and non-interactive until revealed.
const BackToTopSticker = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll(); // sync initial state (e.g. reload while scrolled down)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-30 transition-opacity duration-300 sm:bottom-8 sm:right-8 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Outer element holds the tilt; inner button owns the hover scale so
          the two transforms compose cleanly. */}
      <div className="rotate-15">
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          tabIndex={visible ? 0 : -1}
          className="cursor-pointer rounded-lg border-[5px] border-[#eaeaea] bg-[#0d5127] px-2.5 py-2 text-white shadow-[0_1.5px_1.5px_0_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:scale-110"
        >
          <span className="whitespace-nowrap text-base font-bold sm:text-xl">
            BACK TO TOP
          </span>
        </button>
      </div>
    </div>
  );
};

export default BackToTopSticker;
