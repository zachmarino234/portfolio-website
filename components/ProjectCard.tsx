'use client'
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
    children: React.ReactNode;
    bgColor?: string;
    link: string;
    ariaLabel: string;
    videoSrc?: string;
}

const ProjectCard = ({ children, bgColor, link, ariaLabel, videoSrc }: ProjectCardProps) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        setIsPlaying(true);
    };

    const handleMouseLeave = () => {
        setIsPlaying(false);
    };

    return (
        <Link 
            href={"/projects/" + link} 
            aria-label={ariaLabel} 
            className="relative w-full aspect-square flex flex-col p-10 justify-center items-center gap-2.5 rounded-md overflow-hidden" 
            style={{ backgroundColor: bgColor || '#d9d9d9' }}
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
        >
            {/* Video background with fade-in */}
            <AnimatePresence>
                {isPlaying && videoSrc && (
                    <motion.video
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-10"
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </motion.video>
                )}
            </AnimatePresence>

            {/* Black gradient overlay with fade-in */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-20" 
                    />
                )}
            </AnimatePresence>

            {/* Logo - stays on top */}
            <div className="relative z-30 flex items-center justify-center w-full">
                {children}
            </div>
        </Link>
    );
};

export default ProjectCard;