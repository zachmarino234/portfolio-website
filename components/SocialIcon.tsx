"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { LuCheck } from "react-icons/lu";

const SocialIcon = ({
    children,
    backgroundColor,
    link,
    label,
    // When set, clicking copies this value to the clipboard and briefly swaps
    // the icon for a checkmark instead of navigating (used for the email icon).
    copyValue,
    // Size-related utilities are isolated here so callers (e.g. the hero collage)
    // can swap fixed pixels for container units without fighting the base classes.
    sizeClassName = "rounded-2xl border-8 p-4",
}: {
    children: React.ReactNode;
    backgroundColor?: string;
    link?: string;
    label?: string;
    copyValue?: string;
    sizeClassName?: string;
}) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const baseClass = `inline-flex items-center border-[#eaeaea] text-white shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-lg [&_svg]:scale-125 ${sizeClassName}`;

    if (copyValue) {
        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(copyValue);
            } catch {
                return; // clipboard unavailable (e.g. insecure context) — no-op
            }
            setCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        };

        return (
            <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Email address copied to clipboard" : label}
                style={backgroundColor ? { backgroundColor } : undefined}
                className={`${baseClass} cursor-pointer`}
            >
                {copied ? <LuCheck aria-hidden /> : children}
            </button>
        );
    }

    return (
        <Link
            href={link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={backgroundColor ? { backgroundColor } : undefined}
            className={baseClass}
        >
            {children}
        </Link>
    );
};

export default SocialIcon;
