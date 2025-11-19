import Link from "next/link";

const Header = () => {
    return (
        <header className="flex w-full max-w-3xl items-center justify-between">
            <Link href={"/"} className="font-title text-2xl mb-3 mx-1 sm:text-4xl sm:mb-5 sm:mx-2 text-white">Zach Marino</Link>
            <nav>
                <ul className="flex items-center gap-5">
                    <li>
                        <Link href={"/about"} className="font-body">about</Link>
                    </li>
                    <li>
                        <Link href={"/work"} className="font-body">work</Link>
                    </li>
                    <li>
                        <Link href={"Resume - Zach Marino - Nov 4.pdf"} target="_blank">resume</Link>
                    </li>

                </ul>
            </nav>
        </header>
    );
}

export default Header;