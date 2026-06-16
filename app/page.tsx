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
      <div className="fixed bottom-0 left-0 -z-10 hidden sm:block">
        <HomePageSVG />
      </div>
      <div className="flex flex-col gap-2.5 px-10 sm:px-16  max-w-3xl">
        <p>Zach Marino is a multi-hyphenate product designer and web developer focused on the media and entertainment space. His work refines the experiences creatives and consumers have with the media they love. <Link href={"/about"} className="underline" aria-label="Read More">read more</Link></p>
        <p>Prev. Product Design Internship at Dow Jones and Product Management Co-op at the Boston Globe</p>
        <div className="flex w-full items-center gap-5">
          <p className="py-3">Find me here:</p>
          <SocialIcons />
        </div>
      </div>

      <ProjectGrid />
    </PageMain>
  );
}
