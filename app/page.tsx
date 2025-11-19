import ProjectGrid from "@/components/ProjectGrid";
import SocialIcons from "@/components/SocialIcons";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full max-w-3xl flex-col items-center gap-10 py-12 sm:py-24">
      <div className="flex flex-col gap-2.5">
        <p>zach marino is a multi-hyphenate experience designer and web developer focused on the media and entertainment space. his work refines the experiences creatives and consumers have with the media they love. <Link href={"/about"} className="underline">read more</Link></p>
        <div className="flex w-full items-center gap-5">
          <p className="py-3">find me here:</p>
          <SocialIcons />
        </div>
      </div>
      <h2 className="self-start text-xl sm:text-2xl font-bold">projects</h2>
      <ProjectGrid />
    </main>
  );
}
