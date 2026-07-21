import dynamic from "next/dynamic";
import ProjectGrid from "@/components/ProjectGrid";
import { PersonSchema } from "@/schemas/PersonSchema";
import HeroPlaceholder from "@/components/home/HeroPlaceholder";
import AboutSection from "@/components/home/AboutSection";
import HomeFooter from "@/components/home/HomeFooter";
import BackToTopSticker from "@/components/home/BackToTopSticker";
import ScrollToHash from "@/components/home/ScrollToHash";

// Dev-only visual layout editor for the hero collage (activate with `/?edit`).
// Guarded by NODE_ENV so it is tree-shaken out of production builds.
const HeroEditor =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/home/HeroEditor"))
    : () => null;

export default function Home() {
  return (
    <div className="relative w-full bg-[#faf7f1] text-[#1e1e1e]">
      <PersonSchema />
      <ScrollToHash />

      <HeroPlaceholder />
      <HeroEditor />

      {/* Everything below the hero. The back-to-top sticker floats fixed in the
          bottom-right corner once the user scrolls past the first viewport. */}
      <div className="relative">
        <BackToTopSticker />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-24 sm:px-10">
          <AboutSection />

          <section id="projects" className="flex scroll-mt-8 flex-col gap-9">
            <h2 className="text-3xl font-bold sm:text-4xl">PROJECTS</h2>
            <ProjectGrid />
          </section>
        </div>

        <HomeFooter />
      </div>
    </div>
  );
}
