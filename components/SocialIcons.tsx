import Link from "next/link";
import { FaGithub, FaLinkedin, FaSquareBehance } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";

const SocialIcons = () => {
    return (
        <div className="flex gap-5">
            <Link href={"mailto:hello@zmarino.com"} aria-label="Email">
                <LuMail className="w-5 h-5" />
            </Link>
            <Link href={"https://www.linkedin.com/in/zach-marino/"} aria-label="Linkedin Link" target="_blank">
                <FaLinkedin className="w-5 h-5" />
            </Link>
            <Link href={"https://github.com/zachmarino234"} aria-label="Github Link" target="_blank">
                <FaGithub className="w-5 h-5" />
            </Link>
            <Link href={"https://www.behance.net/zacharymarino"} aria-label="Behance Link" target="_blank">
                <FaSquareBehance className="w-5 h-5" />
            </Link>





        </div>
    );
}

export default SocialIcons;