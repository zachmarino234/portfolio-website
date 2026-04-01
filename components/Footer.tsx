import Link from "next/link";
import { FaGithub, FaLinkedin, FaSquareBehance } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";

const Footer = () => {
    return (
        <footer
            className="win-statusbar w-full"
            style={{ marginBottom: "30px" }}
            aria-label="Site footer"
        >
            <div className="win-statusbar-panel flex-1" style={{ fontSize: "11px" }}>
                Designed &amp; developed by Zach Marino
            </div>
            <div
                className="win-statusbar-panel flex items-center gap-3"
                style={{ fontSize: "11px" }}
                aria-label="Social links"
            >
                <Link href={"mailto:hello@zmarino.com"} aria-label="Email" className="hover:underline">
                    <LuMail className="inline" style={{ width: "12px", height: "12px" }} />
                </Link>
                <Link href={"https://www.linkedin.com/in/zach-marino/"} aria-label="LinkedIn" target="_blank" className="hover:underline">
                    <FaLinkedin className="inline" style={{ width: "12px", height: "12px" }} />
                </Link>
                <Link href={"https://github.com/zachmarino234"} aria-label="GitHub" target="_blank" className="hover:underline">
                    <FaGithub className="inline" style={{ width: "12px", height: "12px" }} />
                </Link>
                <Link href={"https://www.behance.net/zacharymarino"} aria-label="Behance" target="_blank" className="hover:underline">
                    <FaSquareBehance className="inline" style={{ width: "12px", height: "12px" }} />
                </Link>
            </div>
            <div
                className="win-statusbar-panel"
                style={{ fontSize: "11px", flexShrink: 0 }}
            >
                Ready
            </div>
        </footer>
    );
}

export default Footer;
