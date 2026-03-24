'use client'
import { X } from "lucide-react";
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

const Header = ({ projects = [] }: HeaderProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const lastScrollY = useRef(0);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current + 5) {
                // scrolling down
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current - 5) {
                // scrolling up
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
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
        <header
            className={`fixed left-1/2 top-3 z-40 flex w-full max-w-6xl -translate-x-1/2 justify-center px-4 sm:top-4 sm:px-6 lg:px-8 transition-all duration-300 ${isVisible || isOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-full"
                }`}
        >
            <div className="flex w-full max-w-278 items-center justify-between gap-3 sm:gap-6 rounded-2xl bg-[#0a0a1e]/85 border border-white/10 px-3 py-2 sm:px-6 sm:py-3 shadow-lg">
                <Link
                    href={"/"}
                    className="font-title text-md sm:text-3xl ml-3 mb-3 text-white hover:text-purple-400 transition-colors"
                >
                    Zach Marino
                </Link>
                <nav className="flex-1">
                    <ul className="flex items-center justify-end gap-3 text-sm sm:gap-5 sm:text-base">
                        <li>
                            <Link
                                href={"/about"}
                                className="font-body rounded-full border border-white/10 px-3 py-1 hover:bg-white/5 transition-colors"
                            >
                                about
                            </Link>
                        </li>
                        <li>
                            <button
                                className="font-body cursor-pointer rounded-full border border-white/10 px-3 py-1 hover:bg-white/5 transition-colors"
                                onClick={toggleMenu}
                                aria-haspopup="true"
                                aria-expanded={isOpen}
                                aria-controls="projects-menu"
                            >
                                work
                            </button>
                            <div
                                id="projects-menu"
                                aria-hidden={!isOpen}
                                className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-150 ${
                                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                }`}
                            >
                                <div
                                    ref={dropdownRef}
                                    className={`relative top-72 sm:top-90 w-[90%] max-w-md rounded-3xl border border-white/10 bg-[#0a0a1e]/95 p-6 sm:p-8 shadow-2xl transform transition-transform duration-150 ${
                                        isOpen ? "translate-y-0" : "-translate-y-2"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-lg sm:text-2xl font-bold">
                                            projects
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={toggleMenu}
                                            className="rounded-full p-1 hover:bg-white/10 transition-colors"
                                            aria-label="Close projects menu"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                                        </button>
                                    </div>
                                    <ul
                                        className="mt-8 flex flex-col gap-6 text-xl sm:text-2xl"
                                        onClick={toggleMenu}
                                    >
                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <li key={project.slug}>
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        className="hover:text-purple-400 transition-colors"
                                                    >
                                                        <span className="block text-xl">
                                                            {project.deliverableName || project.title}
                                                        </span>
                                                        {project.title && project.title !== project.deliverableName && (
                                                            <span className="mt-1 block text-sm sm:text-base text-white/70">
                                                                {project.title}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-sm text-white/60">
                                                No projects available
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li>
                            <Link
                                href={"/Public Resume - Zach Marino.pdf"}
                                target="_blank"
                                className="font-body rounded-full border border-white/10 px-3 py-1 hover:bg-white/5 transition-colors"
                            >
                                resume
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;