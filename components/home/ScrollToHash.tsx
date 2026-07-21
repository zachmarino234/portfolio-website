"use client";

import { useEffect } from "react";

// Cross-route hash navigation (e.g. the "GO BACK" sticker on a project page,
// which links to /#projects) doesn't reliably land in the App Router: the
// target section sits below a tall hero whose images load lazily and shift the
// layout after the browser's initial scroll, dumping you back at the top with
// the hash still in the URL. This re-runs the scroll once the page mounts and
// again as layout settles, and stops the moment the user scrolls themselves so
// we never fight their input.
export default function ScrollToHash() {
	useEffect(() => {
		const id = window.location.hash.slice(1);
		if (!id) return;

		let cancelled = false;
		const cancel = () => {
			cancelled = true;
		};

		const scroll = () => {
			if (cancelled) return;
			// scrollIntoView honors the section's `scroll-mt-*` offset.
			document.getElementById(id)?.scrollIntoView({ block: "start" });
		};

		const passive: AddEventListenerOptions = { passive: true };
		window.addEventListener("wheel", cancel, passive);
		window.addEventListener("touchmove", cancel, passive);
		window.addEventListener("keydown", cancel);

		// Passes cover React paint, lazy image loads, and late reflow.
		const raf = requestAnimationFrame(scroll);
		const timers = [150, 400, 800].map((ms) =>
			window.setTimeout(scroll, ms),
		);
		window.addEventListener("load", scroll);

		return () => {
			cancelAnimationFrame(raf);
			timers.forEach(clearTimeout);
			window.removeEventListener("load", scroll);
			window.removeEventListener("wheel", cancel, passive);
			window.removeEventListener("touchmove", cancel, passive);
			window.removeEventListener("keydown", cancel);
		};
	}, []);

	return null;
}
