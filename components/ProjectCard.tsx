'use client'
import Link from "next/link";
import { useRef, useState } from "react";


interface ProjectCardProps {
    children: React.ReactNode;
    bgColor?: string;
    link: string;
    ariaLabel: string;
}

const ProjectCard = ({ children, bgColor, link, ariaLabel }: ProjectCardProps) => {

    const Style = {
        backgroundColor: bgColor || '#d9d9d9',
    };

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        setIsPlaying(true);
        /*
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
            console.log("playing:" + isPlaying);
        }
        */
    };

    const handleMouseLeave = () => {
        setIsPlaying(false);
        /*
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
            console.log("playing:" + isPlaying);
        }
        */
    };

    return (
        <Link href={"/projects/" + link} aria-label={ariaLabel} className="w-3xs h-3xs flex flex-col p-10 justify-center items-center gap-2.5 self-stretch rounded-md overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {/* Black overlay */}
            <div className="relative inset-0 bg-black opacity-40"></div>

            {/* Logo */}
            <div className="relative inset-0 flex items-center justify-center px-10">
                {children}
            </div>

            {isPlaying && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="relative top-0 left-0 object-contain"
                >
                    <source src="videos/npp_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </Link>
    );

};

export default ProjectCard;