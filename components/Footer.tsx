import SocialIcons from "./SocialIcons";

const Footer = () => {
    return (
        <footer className="flex flex-col sm:flex-row w-full max-w-5xl sm:items-center justify-between gap-5">
            <hr className="sm:hidden"/>
            <div className="flex flex-col gap-2.5 text-sm sm:w-1/2">
                <p>Website designed and developed by Zach Marino</p>
            </div>
            <div className="flex gap-2.5">
                <SocialIcons />
            </div>
        </footer>
    );
}

export default Footer;