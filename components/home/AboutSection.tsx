import Image from "next/image";
import Headshot from "@/public/images/zach.png";
import SocialIcons from "@/components/SocialIcons";
import Link from "next/link";

// About section for the redesigned home page. Text mirrors the Figma copy; the
// headshot is framed as a slightly-tilted polaroid.
const AboutSection = () => {
  return (
    <section id="about" className="flex scroll-mt-24 flex-col gap-8">
      <h2 className="text-3xl font-bold sm:text-4xl">ABOUT ME</h2>
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-5 text-base leading-relaxed sm:text-lg md:max-w-2xl">
          <div className="font-bold">
            Currently: Doing full-stack website design for agencies and theatrical productions, as well as freelance graphic design work for <Link href="https://lnkd.in/p/eucDSpt3" target="_blank" rel="noopener noreferrer" className="underline">
              Theatrely
            </Link>.
          </div>
          <p className="text-[16px]">
            Hi I&rsquo;m Zach! I&rsquo;m a design engineer who brings a product manager&rsquo;s judgment to everything I design and build. Before I open Figma or write any code, I want to know who the work is for, what problem it solves, and what success looks like. In fact, I even write PRDs for myself to sort out project priorities and requirements. I&rsquo;ve worked as a PM, a designer, and an engineer, and the best work I&rsquo;ve done came from using skills from each discipline.
          </p>
          <p className="text-[16px]">
            Right now I design and build responsive full-stack websites for theatrical productions and creative agencies. Before that, I interned on the product team at Dow Jones, where I drove a major feature and the first AI-enabled feature to production for Dow Jones&rsquo; B2B product suite. I also spent eight months as a Product Manager at The Boston Globe
          </p>
          <p className="text-[16px]">
            I earned a master&rsquo;s in Experience Design from Northeastern University, after graduating Magna Cum Laude with a bachelor&rsquo;s in Computer Science and Design. That interdisciplinary skill set is the foundation of how I work. It covers experience design theory, interaction design, full-stack software engineering, and in-depth research methods.
          </p>
          <p className="text-[16px]">
            In my spare time, I love discovering new music, watching baseball, and catching a Broadway show (don&rsquo;t ask me how many times I&rsquo;ve seen Operation Mincemeat and Just In Time)
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span>Find me here:</span>
            <SocialIcons />
          </div>
        </div>

        <div className="flex shrink-0 justify-center md:pt-2">
          <div className="rotate-3 rounded-sm border-12 border-b-48 border-white bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <Image
              src={Headshot}
              alt="Zach Marino"
              className="h-auto w-56 object-cover sm:w-64"
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
