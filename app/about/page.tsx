import Image from "next/image";
import Headshot from "@/public/images/zach.png";
import PageMain from "@/components/PageMain";
import { PersonSchema } from "@/schemas/PersonSchema";
import SocialIcons from "@/components/SocialIcons";

export default function About() {
    return (
        <PageMain>
            <PersonSchema />
            <div className="flex flex-col w-full md:flex-row gap-10 py-20 items-center">
                <div className="flex flex-col gap-3">
                    <p>
                        Zach Marino is a multi-hyphenate UX designer and web developer focused on the media and entertainment space. He serves as the brand designer and developer for No Pool Productions, a theatrical production startup, where he designed the brand identity and website. Previously, he has worked as a Product Designer at Dow Jones and also spent eight months as a Product Manager at Boston Globe Media. He is set to graduate from Northeastern University with a Masters in Experience Design after completing his bachelors degree in three years.
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

        </PageMain>
    );
}
