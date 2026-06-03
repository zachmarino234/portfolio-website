"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

interface ProjectCardProps {
    slug: string;
    title: string;
    shortDescription?: string;
    tags?: string[];
    heroImageUrl: string;
    hoverVideoUrl?: string;
    orderLabel?: number;
}

const ProjectCard = ({
    slug,
    title,
    shortDescription,
    tags,
    heroImageUrl,
    hoverVideoUrl,
    orderLabel,
}: ProjectCardProps) => {
    const tagsString = (tags || []).join(", ");
    const displayOrder = typeof orderLabel === "number" ? orderLabel : undefined;
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        const video = videoRef.current;
        if (!video) return;
        void video.play().catch(() => {});
    };

    const handleMouseLeave = () => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
    };

    return (
        <Link
            href={`/projects/${slug}`}
            aria-label={title}
            onMouseEnter={hoverVideoUrl ? handleMouseEnter : undefined}
            onMouseLeave={hoverVideoUrl ? handleMouseLeave : undefined}
            className="group relative flex w-full max-w-[650px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1e]/85 shadow-sm transition duration-300 hover:bg-[#0a0a1e] hover:shadow-[0_4px_4px_2px_rgba(0,0,0,0.25)]"
        >
            {displayOrder !== undefined && (
                <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-xs font-medium text-white/80">
                    {String(displayOrder).padStart(2, "0")}
                </span>
            )}

            <div className="relative h-[210px] w-full overflow-hidden sm:h-[280px]">
                <Image
                    src={heroImageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                />
                {hoverVideoUrl && (
                    <video
                        ref={videoRef}
                        src={hoverVideoUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={heroImageUrl}
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                )}
            </div>

            <div className="flex flex-col gap-5 pt-3 pb-5 px-4 text-white sm:px-7 sm:pt-5 sm:pb-7">
                {tagsString && (
                    <p className="small-caps self-center font-normal text-center text-white sm:text-left">
                        {tagsString}
                    </p>
                )}

                <div className="flex flex-col gap-2 whitespace-pre-wrap">
                    <h3 className="text-base font-semibold leading-normal sm:text-xl sm:leading-8">
                        {title}
                    </h3>
                    {shortDescription && (
                        <p className="text-xs leading-5 text-white/80 sm:text-base sm:leading-[1.6]">
                            {shortDescription}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;