import Image from "next/image";
import Headshot from "@/public/images/zach.png";

export default function Home() {
    return (
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-10 py-12 sm:py-24">
            <div className="flex flex-col w-full md:flex-row gap-10 items-center">
                <div className="flex flex-col gap-3">
                    <p>
                        Zach Marino is a multi-faceted experience designer and web developer focused on the media and entertainment space. He serves as the brand designer and developer for No Pool Productions, a theatrical production startup, where he designed the brand identity and website. Previously, he has worked as a Product Designer at Dow Jones and also spent eight months as a Product Manager at Boston Globe Media. He is set to graduate from Northeastern University with a Masters in Experience Design after completing his bachelors degree in three years.
                    </p>
                    <p>
                        In his free time, Zach likes to discover new music, watch baseball, and see Operation Mincemeat on Broadway arguably more often than a person should.
                    </p>
                </div>
                <Image src={Headshot} alt={"Zach Marino"} className="w-full md:w-1/2 aspect-square" />
            </div>

        </main>
    );
}
