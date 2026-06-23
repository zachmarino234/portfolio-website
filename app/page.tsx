import ProjectGrid from "@/components/ProjectGrid";
import SocialIcons from "@/components/SocialIcons";
import PageMain from "@/components/PageMain";
import { PersonSchema } from "@/schemas/PersonSchema";
import Link from "next/link";
import HomePageSVG from "@/components/homePageSVG";

export default function Home() {
  return (
    <PageMain minHeight={false}>
      <PersonSchema />
      <div className="w-full max-w-5xl px-6 sm:px-10">
        <HomePageSVG />
      </div>
      <div className="flex flex-col gap-2.5 px-10 sm:px-16  max-w-3xl">
        <p>Zach Marino is a product designer and web developer whose background in media and entertainment informs a design process that improves the relationship between creators and their tools, and between consumers and their goals. <Link href={"/about"} className="underline" aria-label="Read More">read more</Link></p>
        <p>Prev. Product Design Internship at Dow Jones and Product Management Co-op at the Boston Globe. Currently job hunting and doing freelance dessign work on Broadway!</p>
        <div className="flex w-full items-center gap-5">
          <p className="py-3">Find me here:</p>
          <SocialIcons />
        </div>
      </div>

      <ProjectGrid />
    </PageMain>
  );
}
