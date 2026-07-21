import SocialIcon from "./SocialIcon";
import { FaGithub, FaLinkedin, FaSquareBehance } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";


// The full row of social/contact icons, composed from the single-icon
// `SocialIcon` building block. Icons inherit the surrounding text color.
const SocialIcons = () => {
  return (
    <div className="flex gap-3 sm:gap-5">
      <SocialIcon backgroundColor="#5650C6" label="Copy email address hello@zmarino.com" copyValue="hello@zmarino.com">
        <LuMail />
      </SocialIcon>
      <SocialIcon backgroundColor="#0A65C2" label="Linkedin profile for Zach Marino" link="https://www.linkedin.com/in/zach-marino/">
        <FaLinkedin />
      </SocialIcon>
      <SocialIcon backgroundColor="#000207" label="Github profile for Zach Marino" link="https://www.github.com/zachmarino234">
        <FaGithub />
      </SocialIcon>
      <SocialIcon backgroundColor="#0055FF" label="Behance profile for Zach Marino" link="https://www.behance.net/zacharymarino">
        <FaSquareBehance />
      </SocialIcon>
    </div>
  );
};

export default SocialIcons;
