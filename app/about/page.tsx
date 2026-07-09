import Image from "next/image";
import Headshot from "@/public/images/zach.png";
import PageMain from "@/components/PageMain";
import { PersonSchema } from "@/schemas/PersonSchema";
import SocialIcons from "@/components/SocialIcons";
import IframeLoader from "@/components/IFrameLoader";

export default function About() {
    return (
        <PageMain>
            <PersonSchema />
            <div className="flex flex-col w-full md:flex-row gap-10 items-center">
                <div className="flex flex-col gap-3">
                    <p>
                        Zach Marino is a product designer and web developer with a background in the media and entertainment space. He serves as the brand designer and developer for No Pool Productions, a theatrical production startup, where he designed the brand identity and website. Previously, he has worked as a Product Designer at Dow Jones and also spent eight months as a Product Manager at Boston Globe Media. He graduated from Northeastern University with a Masters in Experience Design after completing his bachelors degree in three years.
                    </p>
                    <p>
                        In his free time, Zach likes to discover new music, watch baseball, and see Operation Mincemeat on Broadway arguably more often than a person should.
                    </p>
                    <div className="flex flex-col gap-2.5 mt-5">
                        <p>
                            Zach can be found here.
                        </p>
                        <div className="flex gap-2.5">
                            <SocialIcons />
                        </div>
                    </div>

                </div>
                <Image src={Headshot} alt={"Zach Marino"} className="w-full md:w-1/2 aspect-square rounded-2xl bg-[#0a0a1e]/85 border border-white/10 shadow-lg" />
            </div>
            <h2 className="self-start text-xl sm:text-2xl font-bold mt-10 -mb-5">upcoming website changes</h2>
            <p className="self-start -mb-5">This site is designed and coded by me. Upcoming changes can be viewed here!</p>
            <IframeLoader src="https://embed.figma.com/design/CcpVgZ02dqBftlr8gLgN6C/Ghost-Portfolio?node-id=0-1&embed-host=share" title="Figma file showcasing upcoming changes for the website"></IframeLoader>

        </PageMain>
    );
}
