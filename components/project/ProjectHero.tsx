"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProjectTitleSticker from "@/components/project/ProjectTitleSticker";
import LoadingSticker from "@/components/LoadingSticker";
import { useLightbox } from "@/components/Lightbox";

// Hero for a project page, with a branded loading overlay that stays up until
// the hero image has actually painted.
//
// Why not rely on the route's loading.tsx? That Suspense fallback only spans
// the SERVER render — it unmounts the moment the RSC payload arrives, which is
// before the hero image's bytes stream in on the client. And because project
// pages are statically prerendered and prefetched, the server render is
// instant, so loading.tsx never shows in production at all. Tying the overlay
// to the image's own load event is what actually covers the visible gap.
export default function ProjectHero({
	src,
	zoomSrc,
	title,
	aspectRatio,
}: {
	src: string;
	// Higher-resolution render for the click-to-enlarge overlay. The hero is
	// cropped with object-cover, so enlarging also reveals the full frame.
	zoomSrc?: string;
	title: string;
	// Source aspect ratio (width / height). When known, the hero preserves it
	// on small viewports instead of cropping to a fixed height.
	aspectRatio?: number;
}) {
	const [loaded, setLoaded] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);
	const openLightbox = useLightbox();
	const canZoom = Boolean(zoomSrc && openLightbox);

	// A cached image can finish before React attaches onLoad; check the DOM
	// node on mount so the overlay still clears in that case.
	useEffect(() => {
		if (imgRef.current?.complete) setLoaded(true);
	}, []);

	return (
		<div className="relative w-full">
			{!loaded && <LoadingSticker />}

			<div
				className={`relative w-full overflow-hidden ${
					aspectRatio
						? "max-sm:aspect-(--hero-ar) max-sm:h-auto max-sm:max-h-none max-sm:min-h-0 "
						: ""
				}h-[60vh] max-h-[850px] min-h-[320px]`}
				style={
					aspectRatio
						? ({ "--hero-ar": String(aspectRatio) } as React.CSSProperties)
						: undefined
				}
			>
				<Image
					ref={imgRef}
					src={src}
					alt={title}
					fill
					priority
					className="object-cover"
					sizes="100vw"
					onLoad={() => setLoaded(true)}
				/>

				{/* Click target laid over the image rather than wrapping the
				    frame, so the aspect-ratio sizing above stays untouched. It
				    sits below the title sticker (z-20). */}
				{canZoom && (
					<button
						type="button"
						onClick={() => openLightbox?.({ src, fullSrc: zoomSrc, alt: title })}
						aria-label={`Enlarge hero image: ${title}`}
						className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
					/>
				)}
			</div>
			<div className="absolute bottom-0 left-4 z-20 translate-y-1/2 sm:left-10">
				<ProjectTitleSticker title={title} />
			</div>
		</div>
	);
}
