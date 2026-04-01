'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ProjectLink = {
    slug: string;
    title: string;
    deliverableName?: string;
};

interface HeaderProps {
    projects?: ProjectLink[];
}

// Tiny Win2000-style pixel icons as inline SVGs
const WindowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="1" width="14" height="14" fill="#008080" />
        <rect x="1" y="1" width="14" height="3" fill="#000080" />
        <rect x="2" y="5" width="6" height="5" fill="#ffffff" stroke="#000000" strokeWidth="0.5" />
        <rect x="9" y="5" width="5" height="5" fill="#ffff00" stroke="#000000" strokeWidth="0.5" />
        <rect x="2" y="11" width="12" height="3" fill="#c0c0c0" stroke="#000000" strokeWidth="0.5" />
    </svg>
);

const Header = ({ projects = [] }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [clockTime, setClockTime] = useState("");
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    // Live clock for the taskbar system tray
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setClockTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            {/* Win2000 Taskbar — pinned to bottom */}
            <div
                className="win-taskbar fixed bottom-0 left-0 right-0 z-50"
                role="banner"
                style={{ height: "30px" }}
            >
                {/* Start Button */}
                <button className="win-start-btn text-xs" aria-label="Start">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <rect width="6" height="6" fill="#ff0000" />
                        <rect x="8" width="6" height="6" fill="#00cc00" />
                        <rect y="8" width="6" height="6" fill="#0000ff" />
                        <rect x="8" y="8" width="6" height="6" fill="#ffff00" />
                    </svg>
                    <span className="font-bold">Start</span>
                </button>

                {/* Divider */}
                <div style={{ width: "1px", height: "22px", background: "var(--win-btn-shadow)", borderRight: "1px solid var(--win-btn-highlight)" }} />

                {/* Quick Launch buttons */}
                <Link href="/" className="win-btn text-xs px-2 py-0.5 flex items-center gap-1 no-underline" style={{ height: "22px" }}>
                    <WindowIcon />
                    <span className="hidden sm:inline" style={{ fontSize: "11px" }}>Home</span>
                </Link>
                <Link href="/about" className="win-btn text-xs px-2 py-0.5 flex items-center gap-1 no-underline" style={{ height: "22px" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="5" r="3" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
                        <path d="M2 15c0-4 3-6 6-6s6 2 6 6" stroke="#000" strokeWidth="0.5" fill="#c0c0c0" />
                    </svg>
                    <span className="hidden sm:inline" style={{ fontSize: "11px" }}>About</span>
                </Link>

                <button
                    className="win-btn text-xs px-2 py-0.5 flex items-center gap-1"
                    style={{ height: "22px" }}
                    onClick={toggleMenu}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls="projects-menu"
                >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="1" y="2" width="14" height="12" fill="#c0c0c0" stroke="#000" strokeWidth="0.5" />
                        <rect x="1" y="2" width="14" height="3" fill="#000080" />
                        <rect x="3" y="7" width="10" height="1" fill="#000" />
                        <rect x="3" y="10" width="10" height="1" fill="#000" />
                    </svg>
                    <span className="hidden sm:inline" style={{ fontSize: "11px" }}>Work</span>
                </button>

                <Link href="/Public Resume - Zach Marino.pdf" target="_blank" className="win-btn text-xs px-2 py-0.5 flex items-center gap-1 no-underline" style={{ height: "22px" }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <rect x="2" y="1" width="10" height="14" fill="#ffffff" stroke="#000" strokeWidth="0.5" />
                        <path d="M8 1 L12 5 L12 1Z" fill="#c0c0c0" />
                        <rect x="4" y="7" width="8" height="1" fill="#000" />
                        <rect x="4" y="9" width="8" height="1" fill="#000" />
                        <rect x="4" y="11" width="5" height="1" fill="#000" />
                    </svg>
                    <span className="hidden sm:inline" style={{ fontSize: "11px" }}>Resume</span>
                </Link>

                {/* Spacer */}
                <div className="flex-1" />

                {/* System Tray */}
                <div
                    className="win-statusbar-panel flex items-center gap-2 text-xs"
                    style={{ height: "22px", fontSize: "11px", padding: "1px 8px" }}
                    aria-label="System time"
                >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="#000" strokeWidth="1" fill="#c0c0c0" />
                        <line x1="8" y1="8" x2="8" y2="3" stroke="#000" strokeWidth="1.5" />
                        <line x1="8" y1="8" x2="12" y2="8" stroke="#000" strokeWidth="1" />
                    </svg>
                    {clockTime}
                </div>
            </div>

            {/* Projects Dropdown Modal — Win2000 dialog box */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div
                        ref={dropdownRef}
                        className="win-window"
                        style={{ width: "360px", minWidth: "280px" }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Projects"
                        id="projects-menu"
                    >
                        {/* Title bar */}
                        <div className="win-titlebar">
                            <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <rect x="1" y="2" width="14" height="12" fill="#c0c0c0" stroke="#fff" strokeWidth="0.5" />
                                    <rect x="1" y="2" width="14" height="3" fill="#ffffff" opacity="0.4" />
                                </svg>
                                <span>My Projects</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="win-titlebar-btn" aria-label="Minimize" onClick={toggleMenu}>_</button>
                                <button className="win-titlebar-btn" aria-label="Maximize">&#9633;</button>
                                <button className="win-titlebar-btn" aria-label="Close" onClick={toggleMenu}>&#x2715;</button>
                            </div>
                        </div>

                        {/* Menu bar */}
                        <div className="win-menubar">
                            <span className="win-menubar-item"><u>F</u>ile</span>
                            <span className="win-menubar-item"><u>V</u>iew</span>
                            <span className="win-menubar-item"><u>H</u>elp</span>
                        </div>

                        {/* Toolbar separator */}
                        <div style={{ height: "1px", background: "var(--win-btn-shadow)", margin: "0 2px" }} />
                        <div style={{ height: "1px", background: "var(--win-btn-highlight)", margin: "0 2px" }} />

                        {/* Content */}
                        <div style={{ padding: "8px", background: "var(--win-btn-face)" }}>
                            <div className="win-inset" style={{ padding: "0", overflow: "hidden" }}>
                                <ul
                                    onClick={toggleMenu}
                                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                                    aria-label="Project list"
                                >
                                    {projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <li key={project.slug} style={{ borderBottom: index < projects.length - 1 ? "1px solid var(--win-btn-shadow)" : "none" }}>
                                                <Link
                                                    href={`/projects/${project.slug}`}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        padding: "5px 8px",
                                                        fontSize: "11px",
                                                        fontFamily: "var(--font-body)",
                                                        color: "var(--foreground)",
                                                        textDecoration: "none",
                                                    }}
                                                    className="hover:bg-[#000080] hover:text-white transition-colors"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                                                        <rect x="1" y="3" width="14" height="10" fill="#ffffc0" stroke="#000" strokeWidth="0.5" />
                                                        <rect x="1" y="3" width="5" height="2" fill="#ffff00" />
                                                    </svg>
                                                    <span>
                                                        {project.deliverableName || project.title}
                                                        {project.title && project.title !== project.deliverableName && (
                                                            <span style={{ color: "inherit", opacity: 0.7 }}> — {project.title}</span>
                                                        )}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ padding: "8px", fontSize: "11px", color: "var(--foreground)" }}>
                                            No projects available
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Status bar */}
                        <div className="win-statusbar">
                            <div className="win-statusbar-panel flex-1">{projects.length} object(s)</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
