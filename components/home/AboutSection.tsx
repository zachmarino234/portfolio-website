import Image from "next/image";
import Headshot from "@/public/images/zach.png";
import SocialIcons from "@/components/SocialIcons";

// About section for the redesigned home page. Text mirrors the Figma copy; the
// headshot is framed as a slightly-tilted polaroid.
const AboutSection = () => {
  return (
    <section id="about" className="flex scroll-mt-24 flex-col gap-8">
      <h2 className="text-3xl font-bold sm:text-4xl">ABOUT ME</h2>
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-5 text-base leading-relaxed sm:text-lg md:max-w-2xl">
          <p>
            Currently: Job hunting and doing freelance design work for Theatrely!
          </p>
          <p>
            Hi I&rsquo;m Zach! I&rsquo;m a product designer and web developer
            with a background in the media and entertainment space. I&rsquo;m
            currently the brand designer and developer for No Pool Productions, a
            theatrical production startup, where I designed the brand identity
            and website. Previously, I worked as a Product Designer at Dow Jones
            and also spent eight months as a Product Manager at Boston Globe
            Media. I graduated from Northeastern University with a Masters in
            Experience Design after completing my bachelors degree in three
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
          <div className="rotate-3 rounded-sm border-[12px] border-b-[48px] border-white bg-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
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
