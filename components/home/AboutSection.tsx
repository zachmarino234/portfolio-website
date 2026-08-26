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
          <p>
            Currently: Job hunting and doing freelance product work for <Link href="https://www.linkedin.com/posts/zach-marino_last-night-broadway-celebrated-the-79th-activity-7469771494370508800-KBxQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEB5ibkBNXcsd0eGj2RNuiWFUhD4561p1ic" target="_blank" rel="noopener noreferrer" className="underline">
              Theatrely
            </Link>
            &nbsp;and finalizing the design and website development for <Link href="https://www.linkedin.com/company/no-pool-prods/" target="_blank" rel="noopener noreferrer" className="underline">
              No Pool Productions
            </Link>
          </p>
          <p>
            Hi I&rsquo;m Zach! I&rsquo;m a product generalist with a background in
            the media and entertainment space. My work wears many hats — design,
            strategy, computer science — but are all in pursuit of creating and
            supporting projects I care about. Exploration guides my creative process,
            and I do my best work when I can truly learn about and empathize with the people I&rsquo;m designing for.
          </p>
          <p>
            I&rsquo;m
            currently a freelance product designer for Theatrely, a Broadway media
            company, where I am redesigning their social media templates,
            among other projects. Previously, I  was a product intern at Dow Jones
            and also spent eight months as a product manager at Boston Globe
            Media. I graduated from Northeastern University with a Masters in
            experience design after completing my Bachelors degree in computer science + design in three
            years.
          </p>
          <p>
            In my free time, I like to discover new music, watch baseball,
            explore cities with my camera, and see Operation Mincemeat on
            Broadway arguably more often than a person should.
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
