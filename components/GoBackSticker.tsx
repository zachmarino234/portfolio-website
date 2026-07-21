"use client";

import Link from "next/link";

// The green "GO BACK" sticker from the project page design (Figma node 97:275).
// Reuses the exact sticker treatment from the home page's BackToTopSticker
// (thick #eaeaea border, soft drop shadow, tilt, hover lift). It sticks near the
// top-left as the page scrolls and links back to the home page projects section.
const GoBackSticker = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full">
      <div className="sticky top-6 ml-4 inline-block sm:ml-8">
        {/* Outer element holds the tilt; inner link owns the hover scale so the
            two transforms compose cleanly (matches BackToTopSticker). */}
        <div className="-rotate-3">
          <Link
            href="/#projects"
            aria-label="Go back to projects"
            className="pointer-events-auto inline-block cursor-pointer rounded-lg border-[5px] border-[#eaeaea] bg-[#0d5127] px-2.5 py-2 text-white shadow-[0_1.5px_1.5px_0_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:scale-110"
          >
            <span className="whitespace-nowrap text-base font-bold sm:text-xl">
              GO BACK
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoBackSticker;
