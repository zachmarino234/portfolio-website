'use client'
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaX } from "react-icons/fa6";

const Header = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

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
        <header className="flex w-full max-w-3xl items-center justify-between">
            <Link href={"/"} className="font-title text-2xl mb-3 mx-1 sm:text-4xl sm:mb-5 sm:mx-2 text-white">Zach Marino</Link>
            <nav>
                <ul className="flex items-center gap-5">
                    <li>
                        <Link href={"/about"} className="font-body">about</Link>
                    </li>
                    <li>
                        <button className="font-body cursor-pointer" onClick={toggleMenu}>work</button>
                        {isOpen && (
                            <div className="fixed top-0 left-0 w-full h-screen bg-black/50 z-50">
                                <div className="flex flex-col w-full h-full items-center justify-center">
                                    <div ref={dropdownRef} className="flex flex-col gap-10 bg-black rounded-md p-5">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl sm:text-2xl font-bold">projects</h2>
                                            <X onClick={toggleMenu} className="cursor-pointer"/>
                                        </div>
                                        <ul className="flex flex-col gap-5 text-2xl" onClick={toggleMenu}>
                                            <li>
                                                <Link href={"/projects/fantasy-sportsball"}>fantasy sportsball</Link>
                                            </li>
                                            <li>
                                                <Link href={"/projects/no-pool-productions"}>no pool productions</Link>
                                            </li>
                                            <li>
                                                <Link href={"/projects/dow-jones"}>dow jones</Link>
                                            </li>
                                            <li>
                                                <Link href={"/projects/catalog8h"}>catalog8H</Link>
                                            </li>
                                            <li>
                                                <Link href={"/projects/pitch"}>pitch</Link>
                                            </li>
                                            <li>
                                                <Link href={"/projects/abacus"}>abacus</Link>
                                            </li>
                                        </ul>
                                    </div>

                                </div>

                            </div>



                        )}
                    </li>
                    <li>
                        <Link href={"/Resume Public - Zach Marino.pdf"} target="_blank">resume</Link>
                    </li>

                </ul>
            </nav>
        </header>
    );
}

export default Header;