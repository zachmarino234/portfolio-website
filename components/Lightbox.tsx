"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Caption from "@/components/blocks/Caption";

// Keep in sync with the transition durations on the overlay below.
const FADE_MS = 200;

export type LightboxImage = {
	/** The inline (already-loaded) render. Shown instantly as a placeholder. */
	src: string;
	/** Higher-resolution render, faded in on top of `src` once it arrives. */
	fullSrc?: string;
	alt?: string;
	caption?: string;
};

type OpenLightbox = (image: LightboxImage) => void;

const LightboxContext = createContext<OpenLightbox | null>(null);

/**
 * Returns the opener, or `null` when there is no provider above — that's how
 * image blocks decide whether they're zoomable, so they stay usable on pages
 * that don't opt into the lightbox.
 */
export function useLightbox() {
	return useContext(LightboxContext);
}

/**
 * Click-to-enlarge overlay. Renders a single portal for the whole subtree; any
 * descendant can open it via `useLightbox()`.
 *
 * Dismisses on Esc, on the close button, and on a click anywhere outside the
 * image itself.
 */
export default function LightboxProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [image, setImage] = useState<LightboxImage | null>(null);
	const [visible, setVisible] = useState(false); // drives the fade/scale in
	const [fullLoaded, setFullLoaded] = useState(false);

	const closeTimer = useRef<number | null>(null);
	const openerRef = useRef<HTMLElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	const open = useCallback<OpenLightbox>((next) => {
		if (closeTimer.current) window.clearTimeout(closeTimer.current);
		// Remember what was focused so Esc/close can hand focus back.
		openerRef.current = document.activeElement as HTMLElement | null;
		setFullLoaded(false);
		setImage(next);
		// Flip to visible on the next frame so the transition runs from 0.
		requestAnimationFrame(() => setVisible(true));
	}, []);

	const close = useCallback(() => {
		setVisible(false);
		closeTimer.current = window.setTimeout(() => {
			setImage(null);
			openerRef.current?.focus();
		}, FADE_MS);
	}, []);

	// Lock body scroll while the overlay is up.
	useEffect(() => {
		if (!image) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [image]);

	// Esc to close; park Tab on the close button so focus can't walk into the
	// page behind (the close button is the dialog's only focusable control).
	useEffect(() => {
		if (!image) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				close();
			} else if (e.key === "Tab") {
				e.preventDefault();
				closeButtonRef.current?.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [image, close]);

	// Move focus into the overlay once it's on screen.
	useEffect(() => {
		if (visible) closeButtonRef.current?.focus();
	}, [visible]);

	useEffect(
		() => () => {
			if (closeTimer.current) window.clearTimeout(closeTimer.current);
		},
		[],
	);

	return (
		<LightboxContext.Provider value={open}>
			{children}

			{/* `image` is only ever set from a click, so this never runs during
			    the server render — no need to guard `document.body`. */}
			{image &&
				createPortal(
					<div
						role="dialog"
						aria-modal="true"
						aria-label={image.alt || "Enlarged image"}
						onClick={close}
						className={`fixed inset-0 z-100 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-200 ease-out sm:p-10 ${
							visible ? "opacity-100" : "opacity-0"
						}`}
					>
						{/* Close control reuses the sticker treatment from
						    GoBackSticker / BackToTopSticker (thick #eaeaea border,
						    green fill, soft drop shadow, tilt, hover lift), tilted the
						    other way since it sits in the opposite corner. The outer
						    element holds the tilt so the two transforms compose
						    cleanly. */}
						<div className="absolute top-4 right-4 z-10 rotate-6 sm:top-6 sm:right-6">
							<button
								ref={closeButtonRef}
								type="button"
								onClick={close}
								aria-label="Close enlarged image"
								className="flex cursor-pointer items-center justify-center rounded-lg border-[5px] border-[#eaeaea] bg-[#0d5127] p-2 text-white shadow-[0_1.5px_1.5px_0_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
							>
								{/* strokeWidth matches the bold weight of the text stickers. */}
								<X aria-hidden strokeWidth={3} className="h-5 w-5 sm:h-6 sm:w-6" />
							</button>
						</div>

						<figure
							// Clicks on the image itself shouldn't dismiss —
							// only clicks on the backdrop around it.
							onClick={(e) => e.stopPropagation()}
							className={`relative flex max-h-full cursor-default flex-col items-center transition-transform duration-200 ease-out ${
								visible ? "scale-100" : "scale-95"
							}`}
						>
							<div className="relative inline-block max-h-[85vh]">
								{/* The inline render is already cached, so it paints
								    immediately and defines the box the full-resolution
								    version fades into. Plain <img> on both: these are
								    pre-sized Sanity CDN URLs and running them back
								    through Next's optimizer would re-compress away the
								    detail this overlay exists to show. */}
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={image.src}
									alt={image.alt ?? ""}
									className="block max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
								/>
								{image.fullSrc && image.fullSrc !== image.src && (
									/* eslint-disable-next-line @next/next/no-img-element */
									<img
										src={image.fullSrc}
										alt=""
										aria-hidden
										onLoad={() => setFullLoaded(true)}
										className={`absolute inset-0 h-full w-full rounded-lg object-contain transition-opacity duration-300 ease-out ${
											fullLoaded ? "opacity-100" : "opacity-0"
										}`}
									/>
								)}
							</div>

							{image.caption && (
								<figcaption className="mt-4">
									<Caption text={image.caption} className="rounded-lg" />
								</figcaption>
							)}
						</figure>
					</div>,
					document.body,
				)}
		</LightboxContext.Provider>
	);
}
