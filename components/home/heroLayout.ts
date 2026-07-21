// Single source of truth for the hero collage layout.
//
// Every sticker is placed by its CENTER as a percentage of the stage (the
// `@container` with the Figma aspect ratio), so the collage scales as one rigid
// unit. `HeroPlaceholder` renders this statically; the dev-only `HeroEditor`
// (visit `/?edit` in development) lets you drag/resize/rotate the stickers and
// copies an updated version of this array to your clipboard to paste back here.
//
// Sizing: `width` (% of stage width, aspect preserved) drives "image" and "cue"
// stickers. `scale` (a transform multiplier) drives "projects" and "socials",
// whose intrinsic size comes from container units (`cqw`) in their components.

import type { CSSProperties } from "react";

export type HeroKind = "image" | "projects" | "socials" | "cue";

export type HeroItem = {
  id: string;
  kind: HeroKind;
  x: number; // center X, % of stage width
  y: number; // center Y, % of stage height
  rotation: number; // degrees
  z: number; // z-index
  width?: number; // % of stage width — "image" & "cue"
  scale?: number; // multiplier (default 1) — "projects", "socials" & "cue"
  // image / cue payload
  src?: string;
  alt?: string;
  imgWidth?: number;
  imgHeight?: number;
  href?: string;
  external?: boolean;
  label?: string;
  priority?: boolean;
};

export const heroLayout: HeroItem[] = [
  {
    id: "wordmark",
    kind: "image",
    x: 47.2,
    y: 35.1,
    rotation: -6,
    z: 30,
    width: 60,
    src: "/images/hero/zachmarino.png",
    alt: "Zach Marino",
    imgWidth: 3104,
    imgHeight: 932,
    priority: true,
  },
  // Temporarily hidden until the Extras section exists — restore to re-enable.
  // {
  //   id: "extras",
  //   kind: "image",
  //   x: 82.5,
  //   y: 30,
  //   rotation: -6,
  //   z: 70,
  //   width: 17,
  //   src: "/images/hero/extras.png",
  //   alt: "Extras",
  //   imgWidth: 898,
  //   imgHeight: 362,
  //   href: "#extras",
  //   label: "Scroll to Extras",
  // },
  {
    id: "resume",
    kind: "image",
    x: 79.1,
    y: 51.5,
    rotation: 0.2,
    z: 50,
    width: 27.5,
    src: "/images/hero/resume.png",
    alt: "Resume",
    imgWidth: 1430,
    imgHeight: 456,
    href: "/Public Resume - Zach Marino.pdf",
    external: true,
    label: "Open resume in a new tab",
  },
  {
    id: "about",
    kind: "image",
    x: 17,
    y: 69.3,
    rotation: 12,
    z: 40,
    width: 27,
    src: "/images/hero/about.png",
    alt: "About",
    imgWidth: 1412,
    imgHeight: 456,
    href: "#about",
    label: "Scroll to About me",
  },
  {
    id: "projects",
    kind: "projects",
    x: 58.9,
    y: 73.4,
    rotation: 1,
    z: 20,
    scale: 0.916,
  },
  {
    id: "socials",
    kind: "socials",
    x: 49.7,
    y: 96.9,
    rotation: 1.7,
    z: 10,
    scale: 1.051,
  },
  { id: "cue", kind: "cue", x: 87.2, y: 104.8, rotation: 0, z: 60, scale: 1 },
];

// The absolute-positioning style for a sticker's wrapper: centered on its
// (x, y) point, then rotated and (optionally) scaled about that center.
export const stickerStyle = (item: HeroItem): CSSProperties => ({
  position: "absolute",
  left: `${item.x}%`,
  top: `${item.y}%`,
  zIndex: item.z,
  width: item.width != null ? `${item.width}%` : undefined,
  transform: `translate(-50%, -50%) rotate(${item.rotation}deg)${item.scale != null ? ` scale(${item.scale})` : ""}`,
});

// Social links for the "socials" sticker cluster. Sized via SOCIAL_SIZE so the
// hero can use container units while the footer keeps fixed pixels.
export const SOCIAL_SIZE =
  "rounded-[1.4cqw] border-[0.8cqw] p-[1.4cqw] text-[2.7cqw]";

export type SocialLink = {
  id: string;
  backgroundColor: string;
  label: string;
  link: string;
  // When set, clicking copies this to the clipboard instead of navigating.
  copyValue?: string;
};

export const socialLinks: SocialLink[] = [
  {
    id: "email",
    backgroundColor: "#5650C6",
    label: "Copy email address hello@zmarino.com",
    link: "mailto:hello@zmarino.com",
    copyValue: "hello@zmarino.com",
  },
  {
    id: "linkedin",
    backgroundColor: "#0A65C2",
    label: "Linkedin profile for Zach Marino",
    link: "https://www.linkedin.com/in/zach-marino/",
  },
  {
    id: "github",
    backgroundColor: "#000207",
    label: "Github profile for Zach Marino",
    link: "https://www.github.com/zachmarino234",
  },
  {
    id: "behance",
    backgroundColor: "#0055FF",
    label: "Behance profile for Zach Marino",
    link: "https://www.behance.net/zacharymarino",
  },
];
