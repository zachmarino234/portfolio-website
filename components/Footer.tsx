import SocialIcons from "./SocialIcons";

const Footer = () => {
    return (
        <footer className="flex flex-col sm:flex-row w-full max-w-3xl sm:items-center justify-between gap-5">
            <hr className="sm:hidden"/>
            <div className="flex flex-col gap-2.5 text-sm sm:w-1/2">
                <p>Website designed and developed by Zach Marino, inspired by futuristic settings like <span className="italic">Mirror&apos;s Edge</span> and <span className="italic">Cyberpunk 2077</span></p>
                <p>No generative AI was used, besides the creation of the background animation</p>
            </div>
            <div className="flex gap-2.5">
                <SocialIcons />
            </div>
        </footer>
    );
}

export default Footer;