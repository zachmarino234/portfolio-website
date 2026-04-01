import Link from "next/link";
import { FaGithub, FaLinkedin, FaSquareBehance } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";

const SocialIcons = () => {
    return (
        <div className="flex gap-2">
            <Link
                href={"mailto:hello@zmarino.com"}
                aria-label="Email"
                className="win-btn"
                style={{ padding: "2px 6px", fontSize: "11px" }}
            >
                <LuMail style={{ width: "12px", height: "12px" }} />
            </Link>
            <Link
                href={"https://www.linkedin.com/in/zach-marino/"}
                aria-label="LinkedIn"
                target="_blank"
                className="win-btn"
                style={{ padding: "2px 6px", fontSize: "11px" }}
            >
                <FaLinkedin style={{ width: "12px", height: "12px" }} />
            </Link>
            <Link
                href={"https://github.com/zachmarino234"}
                aria-label="GitHub"
                target="_blank"
                className="win-btn"
                style={{ padding: "2px 6px", fontSize: "11px" }}
            >
                <FaGithub style={{ width: "12px", height: "12px" }} />
            </Link>
            <Link
                href={"https://www.behance.net/zacharymarino"}
                aria-label="Behance"
                target="_blank"
                className="win-btn"
                style={{ padding: "2px 6px", fontSize: "11px" }}
            >
                <FaSquareBehance style={{ width: "12px", height: "12px" }} />
            </Link>
        </div>
    );
}

export default SocialIcons;
