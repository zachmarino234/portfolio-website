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
    cardColor?: string;
}

const DEFAULT_CARD_COLOR = "#0a0a1e";

const ProjectCard = ({
    slug,
    title,
    shortDescription,
    tags,
    heroImageUrl,
    hoverVideoUrl,
    cardColor,
}: ProjectCardProps) => {
    const pillTags = (tags || []).filter(Boolean);
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
            style={{ backgroundColor: cardColor || DEFAULT_CARD_COLOR }}
            className="group relative flex h-full w-full max-w-[650px] flex-col overflow-hidden rounded-2xl border-[7.5px] border-white shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_6px_12px_0_rgba(0,0,0,0.3)]"
        >
            <div className="relative h-[210px] w-full overflow-hidden sm:h-[280px]">
                <Image
                    src={heroImageUrl}
                    alt={title}
                    fill
                    className="object-cover"
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

            <div className="flex flex-1 flex-col justify-between gap-6 px-6 py-5 text-white sm:px-[30px]">
                <div className="flex flex-col gap-4 whitespace-pre-wrap">
                    <h3 className="text-lg font-bold uppercase leading-tight tracking-[0.48px] sm:text-2xl sm:leading-9">
                        {title}
                    </h3>
                    {shortDescription && (
                        <p className="text-sm leading-6 text-white/90 sm:text-lg sm:leading-[1.6]">
                            {shortDescription}
                        </p>
                    )}
                </div>

                {pillTags.length > 0 && (
                    <div className="flex flex-wrap items-start justify-center gap-3">
                        {pillTags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-white/10 px-2.5 py-[7px] text-sm text-white sm:text-base"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProjectCard;
