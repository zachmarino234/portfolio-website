'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SocialIcons from "./SocialIcons";
import MirrorText from "./MirrorText";

type ProjectLink = {
    slug: string;
    title: string;
    deliverableName?: string;
    seoDescription?: string;
};

interface MenuOverlayProps {
    projects?: ProjectLink[];
}

// Keep these in sync with the durations in the CSS transitions (gradientbg.css).
const REVEAL_MS = 600; // circle expand / collapse
const CONTENT_MS = 260; // content fade in / out

const MenuOverlay = ({ projects = [] }: MenuOverlayProps) => {
    const pathname = usePathname();
    const isHome = pathname === "/"; // the homepage shows the big hero wordmark, so the nav one is redundant
    const [isOpen, setIsOpen] = useState(false); // logical open state (scroll lock, aria)
    const [isRevealed, setIsRevealed] = useState(false); // circle expanded to full viewport
    const [showContent, setShowContent] = useState(false); // menu content faded/staggered in
    const [origin, setOrigin] = useState({ x: 0, y: 0, r: 0 });

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const timers = useRef<number[]>([]);

    const prefersReducedMotion = () =>
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clearTimers = useCallback(() => {
        timers.current.forEach((t) => window.clearTimeout(t));
        timers.current = [];
    }, []);

    // Measure the button's center and the radius needed to cover the viewport
    // from that point (distance to the furthest corner, with a little padding).
    const measure = useCallback(() => {
        const btn = buttonRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const r =
            Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y),
            ) + 8;
        setOrigin({ x, y, r });
    }, []);

    const open = useCallback(() => {
        clearTimers();
        measure();
        setIsOpen(true);

        if (prefersReducedMotion()) {
            setIsRevealed(true);
            setShowContent(true);
            return;
        }

        // Expand on the next frame so the clip-path transition runs from 0.
        requestAnimationFrame(() => requestAnimationFrame(() => setIsRevealed(true)));
        // Reveal the content once the circle has finished expanding.
        timers.current.push(window.setTimeout(() => setShowContent(true), REVEAL_MS));
    }, [clearTimers, measure]);

    const close = useCallback(() => {
        clearTimers();

        if (prefersReducedMotion()) {
            setShowContent(false);
            setIsRevealed(false);
            setIsOpen(false);
            buttonRef.current?.focus();
            return;
        }

        // Fade the content out first, then collapse the circle back into the button.
        setShowContent(false);
        timers.current.push(window.setTimeout(() => setIsRevealed(false), CONTENT_MS));
        timers.current.push(
            window.setTimeout(() => {
                setIsOpen(false);
                buttonRef.current?.focus();
            }, CONTENT_MS + REVEAL_MS),
        );
    }, [clearTimers]);

    const toggle = () => (isOpen ? close() : open());

    // Measure on mount (and on resize) so the collapsed circle is already
    // centered on the button before the first click — otherwise the first
    // reveal interpolates its center from the top-left corner.
    useEffect(() => {
        measure();
        const onResize = () => measure();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [measure]);

    // Lock body scroll while the menu is open.
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    // Clear any pending timers on unmount.
    useEffect(() => clearTimers, [clearTimers]);

    // Build the focus-trap list: every focusable element in the overlay, plus the
    // toggle button (which lives outside the overlay but acts as the close control).
    const getFocusables = useCallback((): HTMLElement[] => {
        const nodes = overlayRef.current
            ? Array.from(
                  overlayRef.current.querySelectorAll<HTMLElement>(
                      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                  ),
              )
            : [];
        const list: HTMLElement[] = [...nodes];
        if (buttonRef.current) list.push(buttonRef.current);
        return list;
    }, []);

    // Esc to close + focus trap while open.
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                close();
                return;
            }
            if (e.key !== "Tab") return;
            const focusables = getFocusables();
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;
            if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, close, getFocusables]);

    // Move focus into the overlay once content is shown.
    useEffect(() => {
        if (!showContent) return;
        const focusables = getFocusables();
        focusables[0]?.focus();
    }, [showContent, getFocusables]);

    const barBase =
        "absolute left-0 block h-0.5 w-6 rounded-full bg-white transition-transform duration-300 ease-out";

    // The hamburger. On the homepage it's a standalone circle; on other pages it
    // lives inside the wordmark bar (below), so it drops its own border/surface.
    const menuButton = (
        <button
            ref={buttonRef}
            type="button"
            onClick={toggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="menu-overlay"
            className={
                isHome
                    ? "font-body pointer-events-auto relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#0a0a1e]/60 backdrop-blur-sm transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 sm:h-14 sm:w-14"
                    : "font-body relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
            }
        >
            <span className="relative block h-4 w-6" aria-hidden="true">
                <span
                    className={`${barBase} top-0 ${isOpen ? "translate-y-[7px] rotate-45" : ""}`}
                />
                <span
                    className={`${barBase} top-1/2 -translate-y-1/2 transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`}
                />
                <span
                    className={`${barBase} bottom-0 ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
                />
            </span>
        </button>
    );

    return (
        <>
            {/* Persistent top bar. On the homepage the big hero wordmark stands in for
                the nav one, so only the hamburger shows; elsewhere the wordmark and
                hamburger sit together as a single pill bar in the top-right. */}
            <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
                <div className="mx-auto flex items-center justify-end px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                    {isHome ? (
                        menuButton
                    ) : (
                        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/25 bg-[#0a0a1e]/60 p-1 backdrop-blur-sm">
                            <Link
                                href="/"
                                onClick={() => isOpen && close()}
                                className="font-body inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-base text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 sm:text-lg"
                            >
                                go home
                            </Link>
                            <span aria-hidden="true" className="h-6 w-px bg-white/15" />
                            {menuButton}
                        </div>
                    )}
                </div>
            </div>

            {/* Full-viewport circular-reveal overlay. */}
            <div
                id="menu-overlay"
                ref={overlayRef}
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                aria-hidden={!isOpen}
                className="menu-overlay menu-gradient-surface fixed inset-0 z-40 overflow-y-auto"
                style={{
                    clipPath: `circle(${isRevealed ? origin.r : 0}px at ${origin.x}px ${origin.y}px)`,
                    pointerEvents: isOpen ? "auto" : "none",
                }}
            >
                <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col justify-between gap-16 px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
                    {/* Projects */}
                    <nav aria-label="Projects">
                        <h2
                            data-show={showContent}
                            className="menu-content-item font-body mb-6 text-sm uppercase tracking-[0.25em] text-white/50 sm:mb-8"
                        >
                            Work
                        </h2>
                        <ul className="flex flex-col gap-6 sm:gap-8">
                            {projects.length > 0 ? (
                                projects.map((project, i) => (
                                    <li
                                        key={project.slug}
                                        data-show={showContent}
                                        className="menu-content-item"
                                        style={{ transitionDelay: `${i * 55}ms` }}
                                    >
                                        <Link
                                            href={`/projects/${project.slug}`}
                                            onClick={close}
                                            className="mirror-group block max-w-3xl"
                                        >
                                            <MirrorText className="mirror-stack--block font-body text-3xl leading-tight sm:text-5xl">
                                                {project.deliverableName || project.title}
                                            </MirrorText>
                                            {project.seoDescription && (
                                                <span className="font-body mt-2 block text-sm text-white/55 sm:text-base">
                                                    {project.seoDescription}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-white/50">No projects available</li>
                            )}
                        </ul>
                    </nav>

                    {/* Contact + secondary links */}
                    <div
                        data-show={showContent}
                        className="menu-content-item flex flex-col gap-10 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between"
                        style={{ transitionDelay: `${projects.length * 55 + 40}ms` }}
                    >
                        <div className="flex flex-col gap-3">
                            <h2 className="font-body text-sm uppercase tracking-[0.25em] text-white/50">
                                Contact
                            </h2>
                            <Link
                                href="mailto:hello@zmarino.com"
                                className="mirror-group font-title text-2xl sm:text-3xl"
                            >
                                <MirrorText>hello@zmarino.com</MirrorText>
                            </Link>
                            <div className="mt-2">
                                <SocialIcons />
                            </div>
                        </div>

                        <nav aria-label="Secondary" className="flex items-center gap-4 text-base">
                            <Link
                                href="/about"
                                onClick={close}
                                className="mirror-pill font-body"
                            >
                                <span aria-hidden="true" className="mirror-pill__face" />
                                <span className="mirror-pill__label">About</span>
                            </Link>
                            <Link
                                href="/Public Resume - Zach Marino.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => isOpen && close()}
                                className="mirror-pill font-body"
                            >
                                <span aria-hidden="true" className="mirror-pill__face" />
                                <span className="mirror-pill__label">Resume ↗</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuOverlay;
