import Image from "next/image";
import Link from "next/link";
import ProjectsSticker from "./ProjectsSticker";
import SmoothScrollLink from "./SmoothScrollLink";
import SocialIcon from "../SocialIcon";
import { LuMail } from "react-icons/lu";
import { FaGithub, FaLinkedin, FaSquareBehance } from "react-icons/fa6";
import { HeroItem, socialLinks, SOCIAL_SIZE } from "./heroLayout";

// The inner visual for a single collage sticker, keyed by `kind`. This is the
// single source of truth for how each sticker looks — both the static hero
// (`HeroPlaceholder`) and the dev editor (`HeroEditor`) render through it, so
// they can never drift apart. Positioning/rotation/scale is applied by the
// caller's wrapper; this component only renders the sticker's contents.
//
// When `editing` is true, images render without their link so drags never
// trigger navigation (the editor also disables pointer events on the content).

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  email: <LuMail />,
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  behance: <FaSquareBehance />,
};

const HeroStickerContent = ({ item, editing = false }: { item: HeroItem; editing?: boolean }) => {
  switch (item.kind) {
    case "image": {
      const image = (
        <Image
          src={item.src!}
          alt={item.alt ?? ""}
          width={item.imgWidth}
          height={item.imgHeight}
          priority={item.priority}
          className="h-auto w-full select-none"
        />
      );
      if (!item.href || editing) {
        return <div className="pointer-events-none w-full">{image}</div>;
      }
      const linkClass = "block w-full cursor-pointer transition duration-300 hover:scale-[1.03]";
      // In-page hash links smooth-scroll (like the PROJECTS sticker); other
      // links (e.g. the resume PDF) use a normal Next.js link.
      if (item.href.startsWith("#")) {
        return (
          <SmoothScrollLink href={item.href} label={item.label} className={linkClass}>
            {image}
          </SmoothScrollLink>
        );
      }
      return (
        <Link
          href={item.href}
          aria-label={item.label}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={linkClass}
        >
          {image}
        </Link>
      );
    }

    case "projects":
      return <ProjectsSticker />;

    case "socials":
      return (
        <div className="flex gap-[2cqw]">
          {socialLinks.map((s) => (
            <SocialIcon key={s.id} backgroundColor={s.backgroundColor} label={s.label} link={s.link} copyValue={s.copyValue} sizeClassName={SOCIAL_SIZE}>
              {SOCIAL_ICONS[s.id]}
            </SocialIcon>
          ))}
        </div>
      );

    case "cue":
      return (
        <div className="flex flex-col items-center text-[#1e1e1e]">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="56" viewBox="0 0 30 56" className="h-[4cqw] w-[3cqw] -translate-x-[1cqw] rotate-[8deg]" fill="none">
            <path d="M19.3169 53.5387C18.965 54.4685 19.4333 55.5075 20.363 55.8594C21.2928 56.2114 22.3318 55.743 22.6837 54.8133L21.0003 54.176L19.3169 53.5387ZM21.0357 54.0825L19.6012 52.9953L19.4443 53.2023L19.3523 53.4452L21.0357 54.0825ZM26.7986 38.5674L28.3801 39.4269L26.7986 38.5674ZM17.2508 15.6583L17.9972 14.0204L17.2508 15.6583ZM11.7189 11.8077L10.4537 13.088L11.7189 11.8077ZM2.00839 9.12445L0.251308 9.51518L0.279448 9.64172L0.325424 9.76291L2.00839 9.12445ZM1.89414 8.61068L3.65121 8.21994L3.43824 7.26222L2.51792 6.92222L1.89414 8.61068ZM1.04749 6.94102C0.144505 7.35681 -0.250452 8.42588 0.165333 9.32887L6.94091 24.0439C7.3567 24.9469 8.42577 25.3418 9.32876 24.926C10.2317 24.5103 10.6267 23.4412 10.2109 22.5382L4.18818 9.45819L17.2682 3.43544C18.1712 3.01966 18.5661 1.95059 18.1503 1.0476C17.7346 0.144615 16.6655 -0.25034 15.7625 0.165443L1.04749 6.94102ZM21.0003 54.176L22.6837 54.8133L22.7191 54.7198L21.0357 54.0825L19.3523 53.4452L19.3169 53.5387L21.0003 54.176ZM21.0357 54.0825L22.4703 55.1697C25.2356 51.521 26.908 48.1586 26.8967 45.2081L25.0967 45.215L23.2967 45.2219C23.3033 46.9267 22.2684 49.4759 19.6012 52.9953L21.0357 54.0825ZM25.0967 45.215L26.8967 45.2081C26.889 43.192 27.3768 41.2731 28.3801 39.4269L26.7986 38.5674L25.217 37.7079C23.9334 40.0699 23.2866 42.5828 23.2967 45.2219L25.0967 45.215ZM26.7986 38.5674L28.3801 39.4269C29.7926 36.8278 29.8921 34.0944 28.6676 31.4045L27.0294 32.1503L25.3911 32.896C26.1459 34.5541 26.0915 36.0988 25.217 37.7079L26.7986 38.5674ZM27.0294 32.1503L28.6676 31.4045C27.6713 29.2158 26.7024 27.1667 25.761 25.2577L24.1466 26.0538L22.5322 26.8499C23.4553 28.7216 24.4082 30.7368 25.3911 32.896L27.0294 32.1503ZM24.1466 26.0538L25.761 25.2577C24.8507 23.4118 23.9931 21.4804 23.1888 19.463L21.5168 20.1297L19.8448 20.7963C20.6824 22.897 21.578 24.915 22.5322 26.8499L24.1466 26.0538ZM21.5168 20.1297L23.1888 19.463C22.1954 16.9716 20.441 15.134 17.9972 14.0204L17.2508 15.6583L16.5044 17.2963C18.1067 18.0264 19.1962 19.1697 19.8448 20.7963L21.5168 20.1297ZM17.2508 15.6583L17.9972 14.0204C16.1768 13.1909 14.5064 12.0318 12.9841 10.5274L11.7189 11.8077L10.4537 13.088C12.2611 14.8741 14.2787 16.2821 16.5044 17.2963L17.2508 15.6583ZM11.7189 11.8077L12.9841 10.5274C10.9617 8.52886 8.47212 7.57347 5.63355 7.7084L5.71901 9.50637L5.80448 11.3043C7.636 11.2173 9.14634 11.7961 10.4537 13.088L11.7189 11.8077ZM5.71901 9.50637L5.63355 7.7084C4.49236 7.76265 3.70662 7.75323 3.22437 7.7036C2.97386 7.67781 2.89849 7.6498 2.92552 7.65948C2.94182 7.66532 3.04738 7.70333 3.18313 7.80386C3.32292 7.90739 3.5534 8.12235 3.69135 8.48598L2.00839 9.12445L0.325424 9.76291C0.657003 10.6369 1.43916 10.951 1.71112 11.0485C2.08204 11.1814 2.48784 11.2468 2.85577 11.2847C3.6104 11.3624 4.61062 11.3611 5.80448 11.3043L5.71901 9.50637ZM2.00839 9.12445L3.76546 8.73371L3.65121 8.21994L1.89414 8.61068L0.137058 9.00142L0.251308 9.51518L2.00839 9.12445ZM1.89414 8.61068L2.51792 6.92222L2.42411 6.88757L1.80033 8.57603L1.17655 10.2645L1.27036 10.2991L1.89414 8.61068Z" fill="black" />
          </svg>
          <span className="mt-[0.5cqw] -rotate-[4deg] text-[2cqw] italic">click me!</span>
        </div>
      );

    default:
      return null;
  }
};

export default HeroStickerContent;
