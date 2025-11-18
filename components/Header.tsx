import Link from "next/link";

const Header = () => {
    return (
        <header className="flex w-full max-w-3xl items-center justify-between">
            <Link href={"/"} className="font-title text-4xl mb-5 mx-2 text-white">Zach Marino</Link>
            <nav>
                <ul className="flex items-center gap-5">
                    <li>
                        <Link href={"/about"} className="font-body">about</Link>
                    </li>
                    <li>
                        <Link href={"/contact"} className="font-body">contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;