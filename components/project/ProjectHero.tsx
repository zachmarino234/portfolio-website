"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProjectTitleSticker from "@/components/project/ProjectTitleSticker";
import LoadingSticker from "@/components/LoadingSticker";

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
	title,
	aspectRatio,
}: {
	src: string;
	title: string;
	// Source aspect ratio (width / height). When known, the hero preserves it
	// on small viewports instead of cropping to a fixed height.
	aspectRatio?: number;
}) {
	const [loaded, setLoaded] = useState(false);
	const imgRef = useRef<HTMLImageElement>(null);

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
			</div>
			<div className="absolute bottom-0 left-4 z-20 translate-y-1/2 sm:left-10">
				<ProjectTitleSticker title={title} />
			</div>
		</div>
	);
}
